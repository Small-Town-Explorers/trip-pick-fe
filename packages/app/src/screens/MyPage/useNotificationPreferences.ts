import { useState } from 'react';
import type { NotificationSettings, UpdateNotificationSettingsRequest } from '../../controllers';
import { ensureNotificationPermission } from '../../permissions/notifications';
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
  const [isGuestUpdating, setIsGuestUpdating] = useState(false);

  const update = async (changes: UpdateNotificationSettingsRequest) => {
    if (isAuthenticated) {
      serverMutation.mutate(changes);
      return;
    }

    const definedChanges = Object.fromEntries(
      Object.entries(changes).filter(([, value]) => value !== null && value !== undefined),
    ) as Partial<NotificationSettings>;
    const nextSettings = { ...guestSettings, ...definedChanges };

    try {
      setIsGuestUpdating(true);
      if (Object.values(definedChanges).some((value) => value === true)) {
        await ensureNotificationPermission();
      }
      await saveGuestNotificationSettings(nextSettings);
      setGuestSettings(nextSettings);
      setGuestError(undefined);
    } catch (error) {
      setGuestError(error instanceof Error ? error : new Error('알림 설정을 저장하지 못했어요.'));
    } finally {
      setIsGuestUpdating(false);
    }
  };

  return {
    settings: isAuthenticated ? serverQuery.data : guestSettings,
    error: isAuthenticated ? serverQuery.error : null,
    isPending: isAuthenticated ? serverQuery.isPending : false,
    isUpdating: isAuthenticated ? serverMutation.isPending : isGuestUpdating,
    mutationError: isAuthenticated ? serverMutation.error : guestError,
    refetch: serverQuery.refetch,
    update,
  };
}
