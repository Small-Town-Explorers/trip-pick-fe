import { useEffect, useRef } from 'react';
import type { KakaoRouteMapProps } from './KakaoMap.types';
import type { KakaoMaps } from './kakao.types';

const getDayColor = (dayIndex: number) => (dayIndex % 2 === 0 ? '#155744' : '#349653');

/** 날짜별 장소와 이동 경로를 표시하는 웹 전용 카카오 지도입니다. */
export function KakaoRouteMap({ coordinates, height = 240, style }: KakaoRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const setStatus = (message: string) => {
      if (!statusRef.current) return;
      statusRef.current.textContent = message;
      statusRef.current.style.display = message ? 'grid' : 'none';
    };
    if (!container) return;

    const locations = coordinates
      .flatMap((day, dayIndex) => day.map((point) => ({ ...point, dayIndex })))
      .map((point, index) => ({ ...point, index: index + 1 }))
      .filter(
        (point): point is { lat: number; lng: number; dayIndex: number; index: number } =>
          point.lat !== null && point.lng !== null,
      );
    if (!locations.length) {
      setStatus('표시할 장소가 없습니다.');
      return;
    }
    if (
      !locations.every(
        ({ lat, lng }) =>
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lng) <= 180,
      )
    ) {
      setStatus('올바른 위도·경도를 입력해주세요.');
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
        const path = locations.map(({ lat, lng }) => new maps.LatLng(lat, lng));
        const map = new maps.Map(container, { center: path[0], level: 3 });
        map.setCopyrightPosition(maps.CopyrightPosition.BOTTOMRIGHT, true);
        const markers = path.map((position, index) => {
          const place = locations[index];
          const color = getDayColor(place.dayIndex);
          const content = document.createElement('div');
          content.setAttribute(
            'aria-label',
            `${place.dayIndex + 1}일차, 전체 ${place.index}번째 장소`,
          );
          const svgNS = 'http://www.w3.org/2000/svg';

          const pin = document.createElementNS(svgNS, 'svg');
          pin.setAttribute('width', '26');
          pin.setAttribute('height', '32');
          pin.setAttribute('viewBox', '0 0 26 32');
          pin.setAttribute('fill', 'none');
          pin.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

          const pathElement = document.createElementNS(svgNS, 'path');
          pathElement.setAttribute(
            'd',
            'M12.5751 0C5.97316 0 0 5.14442 0 13.1007C0 18.1812 3.85111 24.1564 11.5376 31.0422C12.1349 31.5695 13.0309 31.5695 13.6282 31.0422C21.299 24.1564 25.1501 18.1812 25.1501 13.1007C25.1501 5.14442 19.177 0 12.5751 0Z',
          );
          pathElement.setAttribute('fill', color);
          pin.appendChild(pathElement);

          content.style.cssText = 'position:relative;width:26px;height:32px;';
          pin.style.cssText = 'display:block;';

          const label = document.createElement('span');
          label.textContent = String(place.index);
          label.style.cssText =
            'position:absolute;top:0;left:0;width:26px;height:26px;' +
            'display:grid;place-items:center;color:white;font:600 13px/1 sans-serif;';
          content.append(pin, label);
          return new maps.CustomOverlay({
            map,
            position,
            content,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 1,
          });
        });

        // 날짜 경계를 잇는 구간은 출발 장소의 날짜 색상을 사용합니다.
        const lines = path.slice(0, -1).map(
          (position, index) =>
            new maps.Polyline({
              map,
              path: [position, path[index + 1]],
              strokeWeight: 2,
              strokeColor: getDayColor(locations[index].dayIndex),
              strokeOpacity: 0.9,
              strokeStyle: 'shortdot',
            }),
        );
        const bounds = new maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        const distinct = locations.some(
          ({ lat, lng }) => lat !== locations[0].lat || lng !== locations[0].lng,
        );
        const fit = () => {
          map.relayout();
          if (distinct) map.setBounds(bounds, 40, 40, 40, 40);
          else {
            map.setCenter(path[0]);
            map.setLevel(3);
          }
        };
        const observer = new ResizeObserver(fit);
        dispose = () => {
          observer.disconnect();
          markers.forEach((marker) => marker.setMap(null));
          lines.forEach((line) => line.setMap(null));
        };
        observer.observe(container);
        fit();
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
  }, [coordinates]);

  return (
    <div style={{ width: '100%', height, ...style, position: 'relative', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        aria-label="카카오맵 여행 경로"
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
