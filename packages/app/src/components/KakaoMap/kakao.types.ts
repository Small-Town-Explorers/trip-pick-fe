// 이 컴포넌트에서 사용하는 Web SDK 인터페이스입니다.
interface LatLng {
  getLat(): number;
  getLng(): number;
}
interface Bounds {
  extend(point: LatLng): void;
}
interface MapInstance {
  relayout(): void;
  setBounds(bounds: Bounds, top: number, right: number, bottom: number, left: number): void;
  setCenter(point: LatLng): void;
  setLevel(level: number): void;
}
interface Overlay {
  setMap(map: MapInstance | null): void;
}
export interface KakaoMaps {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
  LatLngBounds: new () => Bounds;
  Map: new (container: HTMLElement, options: { center: LatLng; level: number }) => MapInstance;
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
}
