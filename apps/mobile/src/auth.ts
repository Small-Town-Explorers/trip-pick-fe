import { apiRequest, localDataStorage } from '@trip-pick/app';

const ACCESS_TOKEN_KEY = 'trip-pick.access-token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'trip-pick.access-token-expires-at';

type KakaoLoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

export async function loginWithKakaoCode(code: string, redirectUri: string) {
  const token = await apiRequest<KakaoLoginResponse>('/api/v1/auth/kakao/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri }),
  });

  if (!token.accessToken || typeof token.expiresIn !== 'number') {
    throw new Error('서버의 로그인 응답을 확인해 주세요.');
  }

  await Promise.all([
    localDataStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken),
    localDataStorage.setItem(
      ACCESS_TOKEN_EXPIRES_AT_KEY,
      String(Date.now() + token.expiresIn * 1_000),
    ),
  ]);

  return token;
}

export function getAccessToken() {
  const token = localDataStorage.getItemSnapshot(ACCESS_TOKEN_KEY);
  const expiresAt = Number(localDataStorage.getItemSnapshot(ACCESS_TOKEN_EXPIRES_AT_KEY));

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    void clearAccessToken();
    return null;
  }

  return token;
}

export async function clearAccessToken() {
  await Promise.all([
    localDataStorage.removeItem(ACCESS_TOKEN_KEY),
    localDataStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY),
  ]);
}
