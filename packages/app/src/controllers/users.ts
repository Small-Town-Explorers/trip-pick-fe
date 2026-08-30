import { apiRequest } from './apiClient';

export type MyPageSummary = {
  nickname: string;
  daysSinceJoined: number;
  pastTripCount: number;
  savedCourseCount: number;
  discoveredRegionCount: number;
};

export type NicknameResponse = {
  nickname: string;
};

export type AccountInfo = {
  provider: 'KAKAO' | string;
};

export type NotificationSettings = {
  pushEnabled: boolean;
  courseRecommendEnabled: boolean;
  marketingEnabled: boolean;
};

export type UpdateNotificationSettingsRequest = Partial<{
  pushEnabled: boolean | null;
  courseRecommendEnabled: boolean | null;
  marketingEnabled: boolean | null;
}>;

export function getMyPageSummary() {
  return apiRequest<MyPageSummary>('/api/v1/users/me');
}

export function updateNickname(nickname: string) {
  return apiRequest<NicknameResponse>('/api/v1/users/me/nickname', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  });
}

export function getAccountInfo() {
  return apiRequest<AccountInfo>('/api/v1/users/me/account');
}

export function getNotificationSettings() {
  return apiRequest<NotificationSettings>('/api/v1/users/me/notifications');
}

export function updateNotificationSettings(request: UpdateNotificationSettingsRequest) {
  return apiRequest<NotificationSettings>('/api/v1/users/me/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}
