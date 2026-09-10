import type { KakaoRegionMapProps } from './KakaoMap.types';
import { KakaoMapWebView } from './KakaoMapWebView.native';

export function KakaoRegionMap(props: KakaoRegionMapProps) {
  return <KakaoMapWebView {...props} mode="regions" />;
}
