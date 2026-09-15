import { ApiError, LoginScreen } from '@trip-pick/app';
import { login } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { loginWithKakaoAccessToken } from '../auth';

function getLoginErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.code === 'KAKAO_UNAVAILABLE') {
    return '카카오 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.';
  }
  if (error instanceof ApiError && error.code === 'KAKAO_AUTH_FAILED') {
    return '인증 시간이 지났거나 유효하지 않아요. 다시 로그인해 주세요.';
  }
  return error instanceof Error ? error.message : '로그인을 완료하지 못했어요.';
}

function isLoginCancelled(error: unknown) {
  return error instanceof Error && /cancel|cancelled|canceled|access.?denied/i.test(error.message);
}

export default function LoginRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const startKakaoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const kakaoToken = await login();
      await loginWithKakaoAccessToken(kakaoToken.accessToken);
      router.replace('/');
    } catch (error) {
      if (!isLoginCancelled(error)) setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <LoginScreen
        isLoading={isLoading}
        errorMessage={errorMessage}
        onKakaoLogin={() => void startKakaoLogin()}
        onGuestContinue={() => router.replace('/')}
      />
    </>
  );
}
