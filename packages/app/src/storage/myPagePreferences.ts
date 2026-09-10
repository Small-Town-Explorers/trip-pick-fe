import type { NotificationSettings } from '../controllers';
import { localDataStorage, saveLocalData } from './index';

const GUEST_NOTIFICATION_SETTINGS_KEY = 'trip-pick.guest-notification-settings';
export const LOCATION_PERMISSION_PREFERENCE_KEY = 'locationPermissionStatus';

export const DEFAULT_GUEST_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  courseRecommendEnabled: true,
  marketingEnabled: false,
};

export function getGuestNotificationSettingsSnapshot(): NotificationSettings {
  const stored = localDataStorage.getItemSnapshot(GUEST_NOTIFICATION_SETTINGS_KEY);
  if (!stored) return DEFAULT_GUEST_NOTIFICATION_SETTINGS;

  try {
    const settings = JSON.parse(stored) as Partial<NotificationSettings>;
    return {
      pushEnabled:
        typeof settings.pushEnabled === 'boolean'
          ? settings.pushEnabled
          : DEFAULT_GUEST_NOTIFICATION_SETTINGS.pushEnabled,
      courseRecommendEnabled:
        typeof settings.courseRecommendEnabled === 'boolean'
          ? settings.courseRecommendEnabled
          : DEFAULT_GUEST_NOTIFICATION_SETTINGS.courseRecommendEnabled,
      marketingEnabled:
        typeof settings.marketingEnabled === 'boolean'
          ? settings.marketingEnabled
          : DEFAULT_GUEST_NOTIFICATION_SETTINGS.marketingEnabled,
    };
  } catch {
    return DEFAULT_GUEST_NOTIFICATION_SETTINGS;
  }
}

export function saveGuestNotificationSettings(settings: NotificationSettings) {
  return saveLocalData(GUEST_NOTIFICATION_SETTINGS_KEY, settings);
}

export function getLocationPreferenceSnapshot(defaultValue = false) {
  const stored = localDataStorage.getItemSnapshot(LOCATION_PERMISSION_PREFERENCE_KEY);
  return stored === null ? defaultValue : stored === 'true';
}

export function saveLocationPreference(enabled: boolean) {
  return localDataStorage.setItem(LOCATION_PERMISSION_PREFERENCE_KEY, String(enabled));
}
