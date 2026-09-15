const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
const shareWebBaseUrl =
  process.env.EXPO_PUBLIC_SHARE_WEB_BASE_URL ?? 'https://sodosiro.netlify.app';
const shareWebUrl = new URL(shareWebBaseUrl);
const sharedCoursePath = `${shareWebUrl.pathname.replace(/\/$/, '')}/shared-course`;
const compactCoursePath = `${shareWebUrl.pathname.replace(/\/$/, '')}/c`;

if (!kakaoNativeAppKey) {
  throw new Error(
    'EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY is required to configure the Kakao native SDK.',
  );
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    kakaoNativeAppKey,
  },
  android: {
    ...config.android,
    intentFilters: [
      ...(config.android?.intentFilters ?? []),
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: shareWebUrl.protocol.replace(':', ''),
            host: shareWebUrl.hostname,
            pathPrefix: sharedCoursePath,
          },
          {
            scheme: shareWebUrl.protocol.replace(':', ''),
            host: shareWebUrl.hostname,
            path: compactCoursePath,
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    ...(config.plugins ?? []),
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: kakaoNativeAppKey,
        android: {
          authCodeHandlerActivity: true,
          forwardKakaoLinkIntentFilterToMainActivity: true,
        },
        ios: { handleKakaoOpenUrl: true },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
  ],
});
