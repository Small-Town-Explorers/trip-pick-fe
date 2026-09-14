import {
  configureApiAccessToken,
  configureApiBaseUrl,
  configureNativeKakaoMaps,
  LocalStorageGate,
  NavigationProvider,
  type AppRoute,
} from '@trip-pick/app';
import PretendardMedium from '@assets/fonts/native/Pretendard-Medium.otf';
import PretendardRegular from '@assets/fonts/native/Pretendard-Regular.otf';
import PretendardSemiBold from '@assets/fonts/native/Pretendard-SemiBold.otf';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { getAccessToken } from '../auth';

void SplashScreen.preventAutoHideAsync().catch(() => {});

configureNativeKakaoMaps({
  javascriptKey: process.env.EXPO_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY ?? '',
  baseUrl: process.env.EXPO_PUBLIC_KAKAO_MAP_BASE_URL ?? '',
});

configureApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://trippick.kro.kr');
configureApiAccessToken(getAccessToken);

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': PretendardRegular,
    'Pretendard-Medium': PretendardMedium,
    'Pretendard-SemiBold': PretendardSemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="dark" />
      <LocalStorageGate>
        <NavigationProvider
          navigation={{
            navigate: (route: AppRoute) => router.push(route),
            replace: (route: AppRoute) => router.replace(route),
            back: () => router.back(),
          }}
        >
          <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
        </NavigationProvider>
      </LocalStorageGate>
    </>
  );
}
