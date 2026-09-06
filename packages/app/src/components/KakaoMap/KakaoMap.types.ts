import type { CSSProperties } from 'react';

export interface KakaoMapCoordinate {
  lat: number | null;
  lng: number | null;
}

export interface KakaoMapProps {
  /** 날짜별 좌표. 첫 배열은 1일차이며 번호는 전체 장소 순서입니다. */
  coordinates: readonly (readonly KakaoMapCoordinate[])[];
  height?: number;
  style?: CSSProperties;
}
