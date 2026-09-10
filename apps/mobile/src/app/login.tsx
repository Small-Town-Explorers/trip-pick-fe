import { LoginScreen } from '@trip-pick/app';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <LoginScreen
        onKakaoLogin={() => Alert.alert('안내', '카카오 로그인 연결을 준비하고 있어요.')}
        onGuestContinue={() => router.replace('/')}
      />
    </>
  );
}
