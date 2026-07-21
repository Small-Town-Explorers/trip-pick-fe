import { NavigationProvider, type AppRoute } from '@trip-pick/app';
import { Stack, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
    <NavigationProvider
      navigation={{
        navigate: (route: AppRoute) => router.push(route),
        back: () => router.back(),
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationProvider>
  );
}
