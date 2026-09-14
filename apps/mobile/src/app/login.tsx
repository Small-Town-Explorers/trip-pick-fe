import { ApiError, LoginScreen } from '@trip-pick/app';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { loginWithKakaoCode } from '../auth';

WebBrowser.maybeCompleteAuthSession();

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

function getLoginErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.code === 'KAKAO_UNAVAILABLE') {
    return '카카오 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.';
  }
  if (error instanceof ApiError && error.code === 'KAKAO_AUTH_FAILED') {
    return '인증 시간이 지났거나 유효하지 않아요. 다시 로그인해 주세요.';
  }
  return error instanceof Error ? error.message : '로그인을 완료하지 못했어요.';
}

export default function LoginRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const startKakaoLogin = async () => {
    const clientId = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
    const kakaoRedirectUri = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !kakaoRedirectUri) {
      setErrorMessage('모바일 카카오 로그인 환경 설정이 아직 완료되지 않았어요.');
      return;
    }

    if (!kakaoRedirectUri.startsWith('https://')) {
      setErrorMessage('카카오 콜백 주소는 HTTPS 주소여야 해요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const state = Crypto.randomUUID();
      const appRedirectUri = AuthSession.makeRedirectUri({ scheme: 'mobile', path: 'login' });
      const query = new URLSearchParams({
        client_id: clientId,
        redirect_uri: kakaoRedirectUri,
        response_type: 'code',
        state,
      });
      const result = await WebBrowser.openAuthSessionAsync(
        `${KAKAO_AUTHORIZE_URL}?${query.toString()}`,
        appRedirectUri,
      );

      if (result.type !== 'success') {
        if (result.type !== 'cancel' && result.type !== 'dismiss') {
          setErrorMessage('카카오 로그인을 완료하지 못했어요. 다시 시도해 주세요.');
        }
        return;
      }

      const callbackUrl = new URL(result.url);
      const callbackState = callbackUrl.searchParams.get('state');
      const code = callbackUrl.searchParams.get('code');
      const kakaoError = callbackUrl.searchParams.get('error');

      if (callbackState !== state) {
        throw new Error('로그인 요청을 확인할 수 없어요. 다시 시도해 주세요.');
      }
      if (kakaoError || !code) {
        throw new Error('카카오 로그인이 취소되었어요. 다시 시도해 주세요.');
      }

      await loginWithKakaoCode(code, kakaoRedirectUri);
      router.replace('/');
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
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
