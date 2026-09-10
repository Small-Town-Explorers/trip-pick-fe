import { useEffect, useRef } from 'react';
import type { KakaoRegionMapProps } from './KakaoMap.types';
import type { KakaoMaps } from './kakao.types';

const updateMarkerButton = (button: HTMLButtonElement, selected: boolean) => {
  button.setAttribute('aria-pressed', String(selected));
  button.style.background = selected ? '#155744' : '#349653';
};

export function KakaoRegionMap({
  markers,
  selectedId,
  onMarkerPress,
  height = 320,
  style,
}: KakaoRegionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const markerPressRef = useRef(onMarkerPress);
  const markerButtonsRef = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    markerPressRef.current = onMarkerPress;
  }, [onMarkerPress]);

  useEffect(() => {
    markerButtonsRef.current.forEach((button, id) => {
      updateMarkerButton(button, id === selectedId);
    });
  }, [selectedId]);

  useEffect(() => {
    const container = containerRef.current;
    const setStatus = (message: string) => {
      if (!statusRef.current) return;
      statusRef.current.textContent = message;
      statusRef.current.style.display = message ? 'grid' : 'none';
    };
    if (!container) return;

    const locations = markers.filter(
      ({ lat, lng }) =>
        Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180,
    );
    if (!locations.length) {
      setStatus('표시할 방문 지역이 없습니다.');
      return;
    }

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
        const positions = locations.map(({ lat, lng }) => new maps.LatLng(lat, lng));
        const averageLat = locations.reduce((sum, { lat }) => sum + lat, 0) / locations.length;
        const averageLng = locations.reduce((sum, { lng }) => sum + lng, 0) / locations.length;
        const averageCenter = new maps.LatLng(averageLat, averageLng);
        const map = new maps.Map(container, { center: averageCenter, level: 12 });
        map.setCopyrightPosition(maps.CopyrightPosition.BOTTOMRIGHT, true);
        const overlays = locations.map((region, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = region.label;
          button.setAttribute('aria-label', `${region.label} 여행 코스 보기`);
          button.style.cssText =
            'border:0;border-radius:9999px;padding:7px 12px;cursor:pointer;' +
            'white-space:nowrap;color:white;font:600 13px/1.2 sans-serif;' +
            'box-shadow:0 3px 10px rgba(8,25,29,.22);';
          updateMarkerButton(button, false);
          markerButtonsRef.current.set(region.id, button);
          button.addEventListener('click', () => markerPressRef.current(region.id));
          return new maps.CustomOverlay({
            map,
            position: positions[index],
            content: button,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 1,
          });
        });

        const bounds = new maps.LatLngBounds();
        positions.forEach((position) => bounds.extend(position));
        map.relayout();
        if (positions.length > 1) map.setBounds(bounds, 48, 48, 48, 48);
        else map.setLevel(8);
        map.setCenter(averageCenter);

        const observer = new ResizeObserver(() => map.relayout());
        dispose = () => {
          observer.disconnect();
          overlays.forEach((overlay) => overlay.setMap(null));
          markerButtonsRef.current.clear();
        };
        observer.observe(container);
        setStatus('');
      } catch {
        dispose();
        container.replaceChildren();
        setStatus(failure);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      dispose();
      container.replaceChildren();
    };
  }, [markers]);

  return (
    <div style={{ width: '100%', height, ...style, position: 'relative', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        aria-label="방문한 지역 지도"
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
