import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import type { NotificationPermissionState } from './notifications.types';

type NotificationPermissionsStatus = Awaited<ReturnType<typeof Notifications.getPermissionsAsync>>;

let pendingRequest: Promise<NotificationPermissionState> | undefined;

function normalize(permission: NotificationPermissionsStatus): NotificationPermissionState {
  const allowed =
    Platform.OS === 'ios'
      ? permission.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
        permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
        permission.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
      : permission.granted;
  return {
    status: allowed ? 'granted' : permission.status === 'undetermined' ? 'undetermined' : 'denied',
    canAskAgain: permission.canAskAgain,
  };
}

export async function getNotificationPermission(): Promise<NotificationPermissionState> {
  return normalize(await Notifications.getPermissionsAsync());
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  pendingRequest ??= (async () => {
    // Android 13+ requires a channel before the runtime permission prompt.
    if (
      Platform.OS === 'android' &&
      typeof Notifications.setNotificationChannelAsync === 'function'
    ) {
      await Notifications.setNotificationChannelAsync('travel', {
        name: '여행 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const current = await getNotificationPermission();
    if (current.status === 'granted' || !current.canAskAgain) return current;
    return normalize(
      await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      }),
    );
  })().finally(() => {
    pendingRequest = undefined;
  });
  return pendingRequest;
}

export async function ensureNotificationPermission() {
  const permission = await requestNotificationPermission();
  if (permission.status !== 'granted') {
    await openNotificationSettings();
    throw new Error('휴대폰 알림 설정에서 소도시로 알림을 허용한 뒤 다시 켜 주세요.');
  }
}

export async function openNotificationSettings() {
  if (Platform.OS === 'android') {
    const packageName = Constants.expoConfig?.android?.package;
    if (packageName && typeof Linking.sendIntent === 'function') {
      try {
        await Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
          { key: 'android.provider.extra.APP_PACKAGE', value: packageName },
        ]);
        return;
      } catch {
        // Some Android vendors do not expose the dedicated notification screen.
      }
    }
  }
  await Linking.openSettings();
}

export async function initializeNotificationPermissions() {
  const current = await getNotificationPermission();
  // Do not repeat the startup prompt after the user has made a choice.
  if (current.status === 'undetermined') await requestNotificationPermission();
}
