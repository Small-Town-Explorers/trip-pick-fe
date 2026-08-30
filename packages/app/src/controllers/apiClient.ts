const DEFAULT_API_BASE_URL = 'https://trippick.kro.kr';

export type ApiErrorResponse = {
  code: string;
  message: string;
  details: string[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: string[];

  constructor(status: number, response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = response.code;
    this.details = response.details;
  }
}

let apiBaseUrl = DEFAULT_API_BASE_URL;
let accessTokenGetter: (() => string | null) | undefined;

export function configureApiBaseUrl(baseUrl: string) {
  apiBaseUrl = baseUrl.replace(/\/$/, '');
}

export function configureApiAccessToken(getAccessToken: () => string | null) {
  accessTokenGetter = getAccessToken;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = accessTokenGetter?.();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as T | ApiErrorResponse | null;

  if (!response.ok) {
    const error = body as ApiErrorResponse | null;
    throw new ApiError(response.status, {
      code: error?.code ?? 'UNKNOWN_ERROR',
      message: error?.message ?? '요청을 처리하지 못했어요.',
      details: error?.details ?? [],
    });
  }

  if (body === null) {
    throw new ApiError(response.status, {
      code: 'INVALID_RESPONSE',
      message: '서버 응답 형식을 확인해 주세요.',
      details: [],
    });
  }

  return body as T;
}
