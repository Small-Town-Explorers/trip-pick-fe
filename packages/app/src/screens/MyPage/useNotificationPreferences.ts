import { useState } from 'react';
import type { NotificationSettings, UpdateNotificationSettingsRequest } from '../../controllers';
import { ensureNotificationPermission } from '../../permissions/notifications';
import { setCourseRemindersEnabled } from '../../notifications/courseReminders';
import { useNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from '../../queries';
import {
  getGuestNotificationSettingsSnapshot,
  saveGuestNotificationSettings,
} from '../../storage/myPagePreferences';

export function useNotificationPreferences(isAuthenticated: boolean) {
  const serverQuery = useNotificationSettingsQuery(isAuthenticated);
  const serverMutation = useUpdateNotificationSettingsMutation();
  const [guestSettings, setGuestSettings] = useState(getGuestNotificationSettingsSnapshot);
  const [guestError, setGuestError] = useState<Error>();
  const [permissionError, setPermissionError] = useState<Error>();
  const [isGuestUpdating, setIsGuestUpdating] = useState(false);

  const update = async (changes: UpdateNotificationSettingsRequest) => {
    const definedChanges = Object.fromEntries(
      Object.entries(changes).filter(([, value]) => value !== null && value !== undefined),
    ) as Partial<NotificationSettings>;

    try {
      setPermissionError(undefined);
      if (Object.values(definedChanges).some((value) => value === true)) {
        await ensureNotificationPermission();
      }

      if (isAuthenticated) {
        await serverMutation.mutateAsync(changes);
        return;
      }

      const nextSettings = { ...guestSettings, ...definedChanges };
      setIsGuestUpdating(true);
      await saveGuestNotificationSettings(nextSettings);
      await setCourseRemindersEnabled(nextSettings.pushEnabled);
      setGuestSettings(nextSettings);
      setGuestError(undefined);
    } catch (error) {
      const nextError =
        error instanceof Error ? error : new Error('알림 설정을 저장하지 못했어요.');
      if (isAuthenticated) setPermissionError(nextError);
      else setGuestError(nextError);
    } finally {
      setIsGuestUpdating(false);
    }
  };

  return {
    settings: isAuthenticated ? serverQuery.data : guestSettings,
    error: isAuthenticated ? serverQuery.error : null,
    isPending: isAuthenticated ? serverQuery.isPending : false,
    isUpdating: isAuthenticated ? serverMutation.isPending : isGuestUpdating,
    mutationError: isAuthenticated ? (permissionError ?? serverMutation.error) : guestError,
    refetch: serverQuery.refetch,
    update,
  };
}
