import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setCourseRemindersEnabled } from '../notifications/courseReminders';
import {
  getAccountInfo,
  getMyPageSummary,
  getNotificationSettings,
  getPastTrips,
  getVisitedRegions,
  updateNickname,
  updateNotificationSettings,
  type MyPageSummary,
  type NotificationSettings,
} from '../controllers';

export const myPageSummaryQueryKey = ['users', 'me'] as const;
export const accountInfoQueryKey = ['users', 'me', 'account'] as const;
export const notificationSettingsQueryKey = ['users', 'me', 'notifications'] as const;
export const pastTripsQueryKey = ['users', 'me', 'past-trips'] as const;
export const visitedRegionsQueryKey = ['users', 'me', 'visited-regions'] as const;

export function useMyPageSummaryQuery(enabled = true) {
  return useQuery({
    queryKey: myPageSummaryQueryKey,
    queryFn: getMyPageSummary,
    staleTime: 5 * 60 * 1_000,
    enabled,
  });
}

export function usePastTripsQuery(enabled = true) {
  return useQuery({
    queryKey: pastTripsQueryKey,
    queryFn: getPastTrips,
    enabled,
  });
}

export function useVisitedRegionsQuery(enabled = true) {
  return useQuery({
    queryKey: visitedRegionsQueryKey,
    queryFn: getVisitedRegions,
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
    queryFn: async () => {
      const settings = await getNotificationSettings();
      void setCourseRemindersEnabled(settings.pushEnabled).catch(() => {});
      return settings;
    },
    staleTime: 5 * 60 * 1_000,
    enabled,
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
      void setCourseRemindersEnabled(settings.pushEnabled).catch(() => {});
    },
  });
}
