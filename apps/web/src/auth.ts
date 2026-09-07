const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://trippick.kro.kr').replace(
  /\/$/,
  '',
);

const ACCESS_TOKEN_KEY = 'trip-pick.access-token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'trip-pick.access-token-expires-at';

export type KakaoLoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details: string[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: string[];

  constructor(status: number, code: string, message: string, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function loginWithKakaoCode(
  code: string,
  redirectUri: string,
): Promise<KakaoLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/kakao/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri }),
  });

  const body = (await response.json().catch(() => null)) as
    KakaoLoginResponse | ApiErrorBody | null;

  if (!response.ok) {
    const error = body as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      error?.code ?? 'UNKNOWN_ERROR',
      error?.message ?? '로그인을 완료하지 못했어요.',
      error?.details,
    );
  }

  const token = body as KakaoLoginResponse | null;
  if (!token?.accessToken || typeof token.expiresIn !== 'number') {
    throw new ApiError(500, 'INVALID_RESPONSE', '서버의 로그인 응답을 확인해 주세요.');
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(Date.now() + token.expiresIn * 1_000));

  return token;
}

export function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY));

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    clearAccessToken();
    return null;
  }

  return token;
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}

export function createKakaoAuthorizeUrl() {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI ?? `${window.location.origin}/login`;

  if (!clientId) return null;

  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });

  return `https://kauth.kakao.com/oauth/authorize?${query.toString()}`;
}
