import { useQuery } from '@tanstack/react-query';
import { getNoticeDetail, getNotices } from '../controllers';

export const noticesQueryKey = ['notices'] as const;
export const noticeDetailQueryKey = (noticeId: string) => ['notices', noticeId] as const;

export function useNoticesQuery() {
  return useQuery({
    queryKey: noticesQueryKey,
    queryFn: getNotices,
    staleTime: 5 * 60 * 1_000,
  });
}

export function useNoticeDetailQuery(noticeId?: string) {
  return useQuery({
    queryKey: noticeDetailQueryKey(noticeId ?? ''),
    queryFn: () => getNoticeDetail(noticeId!),
    enabled: Boolean(noticeId),
    staleTime: 10 * 60 * 1_000,
  });
}
