import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAccountInfo,
  getMyPageSummary,
  getNotificationSettings,
  updateNickname,
  updateNotificationSettings,
  type MyPageSummary,
  type NotificationSettings,
} from '../controllers';

export const myPageSummaryQueryKey = ['users', 'me'] as const;
export const accountInfoQueryKey = ['users', 'me', 'account'] as const;
export const notificationSettingsQueryKey = ['users', 'me', 'notifications'] as const;

export function useMyPageSummaryQuery() {
  return useQuery({
    queryKey: myPageSummaryQueryKey,
    queryFn: getMyPageSummary,
    staleTime: 5 * 60 * 1_000,
  });
}

export function useUpdateNicknameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNickname,
    onSuccess: ({ nickname }) => {
      queryClient.setQueryData<MyPageSummary>(myPageSummaryQueryKey, (summary) =>
        summary ? { ...summary, nickname } : summary,
      );
    },
  });
}

export function useAccountInfoQuery() {
  return useQuery({
    queryKey: accountInfoQueryKey,
    queryFn: getAccountInfo,
    staleTime: 10 * 60 * 1_000,
  });
}

export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: getNotificationSettings,
    staleTime: 5 * 60 * 1_000,
  });
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: notificationSettingsQueryKey });
      const previousSettings = queryClient.getQueryData<NotificationSettings>(
        notificationSettingsQueryKey,
      );
      if (previousSettings) {
        const definedChanges = Object.fromEntries(
          Object.entries(changes).filter(([, value]) => value !== null && value !== undefined),
        );
        queryClient.setQueryData<NotificationSettings>(notificationSettingsQueryKey, {
          ...previousSettings,
          ...definedChanges,
        });
      }
      return { previousSettings };
    },
    onError: (_error, _changes, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(notificationSettingsQueryKey, context.previousSettings);
      }
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(notificationSettingsQueryKey, settings);
    },
  });
}
