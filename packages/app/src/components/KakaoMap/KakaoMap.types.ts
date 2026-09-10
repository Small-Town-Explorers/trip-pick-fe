import type { CSSProperties } from 'react';

export interface KakaoMapCoordinate {
  lat: number | null;
  lng: number | null;
}

export interface KakaoMapLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface KakaoMapAddressSearchRequest {
  address: string;
  requestId: number;
}

interface KakaoMapBaseProps {
  height?: number;
  style?: CSSProperties;
}

export interface KakaoRouteMapProps extends KakaoMapBaseProps {
  /** 날짜별 좌표. 첫 배열은 1일차이며 번호는 전체 장소 순서입니다. */
  coordinates: readonly (readonly KakaoMapCoordinate[])[];
}

export interface KakaoRegionMarker {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface KakaoRegionMapProps extends KakaoMapBaseProps {
  markers: readonly KakaoRegionMarker[];
  selectedId?: string | null;
  onMarkerPress: (id: string) => void;
}

export interface KakaoLocationPickerMapProps extends KakaoMapBaseProps {
  /** 선택된 위치가 없을 때 지도의 초기 중심을 찾는 지역 주소입니다. */
  initialCenterAddress?: string;
  /** 단일 위치를 선택할 때 사용하는 현재 좌표입니다. */
  selectedCoordinate?: KakaoMapCoordinate | null;
  /** 값이 바뀔 때 카카오 주소 검색으로 좌표를 찾습니다. */
  addressSearchRequest?: KakaoMapAddressSearchRequest | null;
  /** 지정하면 지도 클릭으로 위치를 선택할 수 있습니다. */
  onLocationSelect?: (location: KakaoMapLocation) => void;
  onLocationError?: (message: string) => void;
  onLocationLoadingChange?: (isLoading: boolean) => void;
}
