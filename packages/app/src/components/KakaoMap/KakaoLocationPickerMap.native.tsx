import type { KakaoLocationPickerMapProps } from './KakaoMap.types';
import { KakaoMapWebView } from './KakaoMapWebView.native';

export function KakaoLocationPickerMap(props: KakaoLocationPickerMapProps) {
  return <KakaoMapWebView {...props} mode="picker" />;
}
