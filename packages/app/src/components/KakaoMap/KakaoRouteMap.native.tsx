import type { KakaoRouteMapProps } from './KakaoMap.types';
import { KakaoMapWebView } from './KakaoMapWebView.native';

export function KakaoRouteMap(props: KakaoRouteMapProps) {
  return <KakaoMapWebView {...props} mode="route" />;
}
