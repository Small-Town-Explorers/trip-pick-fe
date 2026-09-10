import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  KakaoLocationPickerMapProps,
  KakaoMapLocation,
  KakaoRegionMapProps,
  KakaoRouteMapProps,
} from './KakaoMap.types';
import { getNativeKakaoMapConfig } from './config';
import { createMapDocument, serializeMapData } from './mapDocument';

type Props =
  | (KakaoRouteMapProps & { mode: 'route' })
  | (KakaoLocationPickerMapProps & { mode: 'picker' })
  | (KakaoRegionMapProps & { mode: 'regions' });

function isLocation(value: unknown): value is KakaoMapLocation {
  if (!value || typeof value !== 'object') return false;
  const location = value as Partial<KakaoMapLocation>;
  return (
    typeof location.lat === 'number' &&
    Number.isFinite(location.lat) &&
    Math.abs(location.lat) <= 90 &&
    typeof location.lng === 'number' &&
    Number.isFinite(location.lng) &&
    Math.abs(location.lng) <= 180 &&
    typeof location.address === 'string' &&
    location.address.length <= 2000
  );
}

export function KakaoMapWebView(props: Props) {
  const webView = useRef<WebView>(null);
  const callbacks = useRef(props);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const config = getNativeKakaoMapConfig();
  const javascriptKey = config?.javascriptKey;
  const baseUrl = config?.baseUrl;
  const source = useMemo(
    () =>
      javascriptKey && baseUrl
        ? {
            html: createMapDocument(javascriptKey),
            baseUrl,
          }
        : undefined,
    [javascriptKey, baseUrl],
  );

  useEffect(() => {
    callbacks.current = props;
  }, [props]);
  const payload = serializeMapData(
    props.mode === 'route'
      ? { mode: 'route', coordinates: props.coordinates }
      : props.mode === 'regions'
        ? { mode: 'regions', markers: props.markers, selectedId: props.selectedId }
        : {
            mode: 'picker',
            initialCenterAddress: props.initialCenterAddress,
            selectedCoordinate: props.selectedCoordinate,
            addressSearchRequest: props.addressSearchRequest,
            canSelect: Boolean(props.onLocationSelect),
          },
  );

  useEffect(() => {
    if (ready) webView.current?.injectJavaScript(`window.updateMap(${payload});true;`);
  }, [payload, ready]);

  useEffect(
    () => () => {
      const current = callbacks.current;
      if (current.mode === 'picker') current.onLocationLoadingChange?.(false);
    },
    [],
  );

  const fail = (message: string) => {
    setReady(false);
    setError(message);
    const current = callbacks.current;
    if (current.mode === 'picker') {
      current.onLocationLoadingChange?.(false);
      current.onLocationError?.(message);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: props.height ?? 240,
        overflow: 'hidden',
        borderRadius: typeof props.style?.borderRadius === 'number' ? props.style.borderRadius : 0,
      }}
    >
      {source && !error ? (
        <WebView
          key={attempt}
          ref={webView}
          source={source}
          style={{ flex: 1, backgroundColor: '#f5f5f5' }}
          accessibilityLabel={
            props.mode === 'route'
              ? '카카오맵 여행 경로'
              : props.mode === 'regions'
                ? '방문한 지역 지도'
                : '카카오맵 위치 선택'
          }
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          nestedScrollEnabled
          originWhitelist={['http://*', 'https://*', 'about:blank']}
          mixedContentMode="never"
          allowFileAccess={false}
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={({ url }) =>
            url === 'about:blank' || url === source.baseUrl
          }
          onError={() => fail('지도를 불러오지 못했어요. 네트워크 연결을 확인해 주세요.')}
          onHttpError={() => fail('지도 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.')}
          onMessage={({ nativeEvent }) => {
            try {
              const message: unknown = JSON.parse(nativeEvent.data);
              if (!message || typeof message !== 'object' || !('type' in message)) return;
              if (message.type === 'ready') {
                setReady(true);
                return;
              }
              if (message.type === 'error') {
                fail('지도를 불러오지 못했어요. 네트워크 연결이나 지도 설정을 확인해 주세요.');
                return;
              }
              const current = callbacks.current;
              if (
                current.mode === 'regions' &&
                message.type === 'regionPress' &&
                'id' in message &&
                typeof message.id === 'string'
              ) {
                current.onMarkerPress(message.id);
                return;
              }
              if (current.mode !== 'picker') return;
              if (
                message.type === 'location' &&
                'location' in message &&
                isLocation(message.location)
              )
                current.onLocationSelect?.(message.location);
              if (
                message.type === 'loading' &&
                'value' in message &&
                typeof message.value === 'boolean'
              )
                current.onLocationLoadingChange?.(message.value);
              if (
                message.type === 'locationError' &&
                'message' in message &&
                typeof message.message === 'string'
              )
                current.onLocationError?.(message.message.slice(0, 200));
            } catch {
              /* Ignore malformed messages from the WebView. */
            }
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Text accessibilityLiveRegion="polite" style={{ color: '#666', textAlign: 'center' }}>
            {error || '모바일 지도 연결을 준비 중이에요.'}
          </Text>
          {source ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setReady(false);
                setError('');
                setAttempt((value) => value + 1);
              }}
            >
              <Text style={{ color: '#155744' }}>지도 다시 불러오기</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}
