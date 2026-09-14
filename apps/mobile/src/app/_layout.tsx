import {
  configureNativeKakaoMaps,
  LocalStorageGate,
  NavigationProvider,
  type AppRoute,
} from '@trip-pick/app';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

configureNativeKakaoMaps({
  javascriptKey: process.env.EXPO_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY ?? '',
  baseUrl: process.env.EXPO_PUBLIC_KAKAO_MAP_BASE_URL ?? '',
});

export default function RootLayout() {
  const router = useRouter();

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
          <Stack screenOptions={{ headerShown: false }} />
        </NavigationProvider>
      </LocalStorageGate>
    </>
  );
}
