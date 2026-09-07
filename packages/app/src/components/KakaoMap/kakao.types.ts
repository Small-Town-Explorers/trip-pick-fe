// 이 컴포넌트에서 사용하는 Web SDK 인터페이스입니다.
interface LatLng {
  getLat(): number;
  getLng(): number;
}
interface Bounds {
  extend(point: LatLng): void;
}
export interface MapInstance {
  relayout(): void;
  setBounds(bounds: Bounds, top: number, right: number, bottom: number, left: number): void;
  setCenter(point: LatLng): void;
  setLevel(level: number): void;
  setCopyrightPosition(position: number, reversed?: boolean): void;
}
interface Overlay {
  setMap(map: MapInstance | null): void;
}
export interface Marker extends Overlay {
  setPosition(position: LatLng): void;
}
interface MapMouseEvent {
  latLng: LatLng;
}
interface AddressSearchResult {
  x: string;
  y: string;
  address_name: string;
}
interface CoordinateAddressResult {
  address: { address_name: string } | null;
  road_address: { address_name: string } | null;
}
export interface Geocoder {
  addressSearch(
    address: string,
    callback: (result: AddressSearchResult[], status: string) => void,
  ): void;
  coord2Address(
    lng: number,
    lat: number,
    callback: (result: CoordinateAddressResult[], status: string) => void,
  ): void;
}
export interface KakaoMaps {
  CopyrightPosition: {
    BOTTOMLEFT: number;
    BOTTOMRIGHT: number;
  };
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
  LatLngBounds: new () => Bounds;
  Map: new (container: HTMLElement, options: { center: LatLng; level: number }) => MapInstance;
  Marker: new (options: { map: MapInstance; position: LatLng }) => Marker;
  CustomOverlay: new (options: {
    map: MapInstance;
    position: LatLng;
    content: HTMLElement;
    xAnchor: number;
    yAnchor: number;
    zIndex: number;
  }) => Overlay;
  Polyline: new (options: {
    map: MapInstance;
    path: LatLng[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }) => Overlay;
  event: {
    addListener(target: MapInstance, type: 'click', handler: (event: MapMouseEvent) => void): void;
    removeListener(
      target: MapInstance,
      type: 'click',
      handler: (event: MapMouseEvent) => void,
    ): void;
  };
  services: {
    Status: { OK: string };
    Geocoder: new () => Geocoder;
  };
}
