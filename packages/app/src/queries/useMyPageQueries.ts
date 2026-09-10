import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureNotificationPermission } from '../permissions/notifications';
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

export function useMyPageSummaryQuery(enabled = true) {
  return useQuery({
    queryKey: myPageSummaryQueryKey,
    queryFn: getMyPageSummary,
    staleTime: 5 * 60 * 1_000,
    enabled,
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

export function useAccountInfoQuery(enabled = true) {
  return useQuery({
    queryKey: accountInfoQueryKey,
    queryFn: getAccountInfo,
    staleTime: 10 * 60 * 1_000,
    enabled,
  });
}

export function useNotificationSettingsQuery(enabled = true) {
  return useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: getNotificationSettings,
    staleTime: 5 * 60 * 1_000,
    enabled,
  });
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (changes) => {
      if (Object.values(changes).some((value) => value === true)) {
        await ensureNotificationPermission();
      }
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
