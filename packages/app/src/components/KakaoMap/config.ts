export type NativeKakaoMapConfig = { javascriptKey: string; baseUrl: string };
let configuration: NativeKakaoMapConfig = { javascriptKey: '', baseUrl: '' };

/** baseUrl must match a JavaScript SDK domain registered for this Kakao app. */
export function configureNativeKakaoMaps(config: NativeKakaoMapConfig) {
  configuration = config;
}

export function getNativeKakaoMapConfig(): NativeKakaoMapConfig | null {
  try {
    const url = new URL(configuration.baseUrl);
    if (!['https:', 'http:'].includes(url.protocol) || !configuration.javascriptKey.trim())
      return null;
    return { javascriptKey: configuration.javascriptKey.trim(), baseUrl: `${url.origin}/` };
  } catch {
    return null;
  }
}
