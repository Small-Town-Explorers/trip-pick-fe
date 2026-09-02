import { apiRequest } from './apiClient';

export type NoticeCategory = '공지' | '안내' | '이벤트';

export type NoticeSummary = {
  id: string;
  category: NoticeCategory;
  title: string;
  publishedAt: string;
};

export type NoticeDetail = NoticeSummary & {
  content: string;
};

export function getNotices() {
  return apiRequest<NoticeSummary[]>('/api/v1/notices');
}

export function getNoticeDetail(noticeId: string) {
  return apiRequest<NoticeDetail>(`/api/v1/notices/${encodeURIComponent(noticeId)}`);
}
