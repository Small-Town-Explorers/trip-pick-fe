import { useEffect, useRef, useState } from 'react';
import type { KakaoLocationPickerMapProps, KakaoMapLocation } from './KakaoMap.types';
import type { Geocoder, KakaoMaps, MapInstance, Marker } from './kakao.types';

const DEFAULT_CENTER = { lat: 36.5, lng: 127.8 };
const LOCATION_FAILURE = '주소를 확인하지 못했어요. 다른 위치를 선택해 주세요.';

function isValidCoordinate(
  coordinate: KakaoLocationPickerMapProps['selectedCoordinate'],
): coordinate is { lat: number; lng: number } {
  return Boolean(
    coordinate &&
    coordinate.lat !== null &&
    coordinate.lng !== null &&
    Number.isFinite(coordinate.lat) &&
    Number.isFinite(coordinate.lng) &&
    Math.abs(coordinate.lat) <= 90 &&
    Math.abs(coordinate.lng) <= 180,
  );
}

/** 주소 검색과 지도 클릭으로 단일 위치를 선택하는 웹 전용 카카오 지도입니다. */
export function KakaoLocationPickerMap({
  initialCenterAddress,
  selectedCoordinate,
  addressSearchRequest,
  onLocationSelect,
  onLocationError,
  onLocationLoadingChange,
  height = 240,
  style,
}: KakaoLocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const geocoderRef = useRef<Geocoder | null>(null);
  const locationSelectRef = useRef(onLocationSelect);
  const locationErrorRef = useRef(onLocationError);
  const loadingChangeRef = useRef(onLocationLoadingChange);
  const latestLocationRequestRef = useRef(0);
  const initializedCenterAddressRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    locationSelectRef.current = onLocationSelect;
    locationErrorRef.current = onLocationError;
    loadingChangeRef.current = onLocationLoadingChange;
  }, [onLocationError, onLocationLoadingChange, onLocationSelect]);

  const updateMarker = (maps: KakaoMaps, lat: number, lng: number, moveMap = true) => {
    const map = mapRef.current;
    if (!map) return;
    const position = new maps.LatLng(lat, lng);
    if (markerRef.current) markerRef.current.setPosition(position);
    else markerRef.current = new maps.Marker({ map, position });
    if (moveMap) map.setCenter(position);
  };

  useEffect(() => {
    const container = containerRef.current;
    const setStatus = (message: string) => {
      if (!statusRef.current) return;
      statusRef.current.textContent = message;
      statusRef.current.style.display = message ? 'grid' : 'none';
    };
    if (!container) return;

    const maps = (window as Window & { kakao?: { maps: KakaoMaps } }).kakao?.maps;
    const failure = '지도를 불러오지 못했습니다. JavaScript 키와 등록 도메인을 확인해주세요.';
    if (!maps) {
      setStatus(failure);
      return;
    }

    let cancelled = false;
    let dispose = () => {};
    setStatus('지도를 불러오는 중입니다.');
    const timeout = window.setTimeout(() => {
      cancelled = true;
      setStatus(failure);
    }, 15000);

    maps.load(() => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      try {
        if (!maps.services) throw new Error('Kakao Maps services library is unavailable.');
        const map = new maps.Map(container, {
          center: new maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: 12,
        });
        const geocoder = new maps.services.Geocoder();
        map.setCopyrightPosition(maps.CopyrightPosition.BOTTOMRIGHT, true);
        mapRef.current = map;
        geocoderRef.current = geocoder;

        const handleClick = ({ latLng }: { latLng: { getLat(): number; getLng(): number } }) => {
          const lat = latLng.getLat();
          const lng = latLng.getLng();
          const requestId = latestLocationRequestRef.current + 1;
          latestLocationRequestRef.current = requestId;

          // 현재 줌 레벨은 유지하고 선택한 좌표로 마커와 지도 중심만 이동합니다.
          updateMarker(maps, lat, lng);
          loadingChangeRef.current?.(true);
          locationErrorRef.current?.('');
          geocoder.coord2Address(lng, lat, (result, status) => {
            if (latestLocationRequestRef.current !== requestId) return;
            loadingChangeRef.current?.(false);
            if (status !== maps.services.Status.OK || !result[0]) {
              locationErrorRef.current?.(LOCATION_FAILURE);
              return;
            }
            const address = result[0].road_address?.address_name ?? result[0].address?.address_name;
            if (!address) {
              locationErrorRef.current?.(LOCATION_FAILURE);
              return;
            }
            const location: KakaoMapLocation = { lat, lng, address };
            locationSelectRef.current?.(location);
          });
        };

        maps.event.addListener(map, 'click', handleClick);
        const fit = () => map.relayout();
        const observer = new ResizeObserver(fit);
        observer.observe(container);
        dispose = () => {
          observer.disconnect();
          maps.event.removeListener(map, 'click', handleClick);
          markerRef.current?.setMap(null);
        };
        fit();
        setStatus('');
        setIsReady(true);
      } catch {
        dispose();
        container.replaceChildren();
        setStatus(failure);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      latestLocationRequestRef.current += 1;
      dispose();
      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isValidCoordinate(selectedCoordinate)) return;
    const maps = (window as Window & { kakao?: { maps: KakaoMaps } }).kakao?.maps;
    if (!maps) return;
    updateMarker(maps, selectedCoordinate.lat, selectedCoordinate.lng);
  }, [isReady, selectedCoordinate]);

  useEffect(() => {
    const address = initialCenterAddress?.trim();
    if (!isReady || !address || initializedCenterAddressRef.current === address) {
      return;
    }

    initializedCenterAddressRef.current = address;
    if (isValidCoordinate(selectedCoordinate)) return;

    const geocoder = geocoderRef.current;
    const maps = (window as Window & { kakao?: { maps: KakaoMaps } }).kakao?.maps;
    if (!geocoder || !maps) return;

    const searchId = latestLocationRequestRef.current + 1;
    latestLocationRequestRef.current = searchId;
    geocoder.addressSearch(address, (result, status) => {
      if (latestLocationRequestRef.current !== searchId) return;
      const first = result[0];
      if (status !== maps.services.Status.OK || !first) return;

      mapRef.current?.setCenter(new maps.LatLng(Number(first.y), Number(first.x)));
      mapRef.current?.setLevel(8);
    });
  }, [initialCenterAddress, isReady, selectedCoordinate]);

  useEffect(() => {
    const address = addressSearchRequest?.address.trim();
    const geocoder = geocoderRef.current;
    const maps = (window as Window & { kakao?: { maps: KakaoMaps } }).kakao?.maps;
    if (!isReady || !address || !geocoder || !maps) return;

    const searchId = latestLocationRequestRef.current + 1;
    latestLocationRequestRef.current = searchId;
    loadingChangeRef.current?.(true);
    locationErrorRef.current?.('');
    geocoder.addressSearch(address, (result, status) => {
      if (latestLocationRequestRef.current !== searchId) return;
      loadingChangeRef.current?.(false);
      const first = result[0];
      if (status !== maps.services.Status.OK || !first) {
        locationErrorRef.current?.('입력한 주소를 찾지 못했어요. 주소를 다시 확인해 주세요.');
        return;
      }
      const lat = Number(first.y);
      const lng = Number(first.x);
      updateMarker(maps, lat, lng);
      locationSelectRef.current?.({ lat, lng, address: first.address_name || address });
    });
  }, [addressSearchRequest, isReady]);

  return (
    <div style={{ width: '100%', height, ...style, position: 'relative', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        aria-label="카카오맵 위치 선택"
        style={{ width: '100%', height: '100%' }}
      />
      <div
        ref={statusRef}
        role="status"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: 16,
          background: '#f5f5f5',
          color: '#666',
          textAlign: 'center',
        }}
      />
    </div>
  );
}
