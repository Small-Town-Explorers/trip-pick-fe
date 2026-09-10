import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationPermissionState } from './notifications.types';

let pendingRequest: Promise<NotificationPermissionState> | undefined;

function normalize(
  permission: Notifications.NotificationPermissionsStatus,
): NotificationPermissionState {
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

export function requestNotificationPermission(): Promise<NotificationPermissionState> {
  pendingRequest ??= (async () => {
    // Android 13+ requires a channel before the runtime permission prompt.
    if (Platform.OS === 'android') {
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
    throw new Error(
      '휴대폰의 알림 권한을 허용한 뒤 다시 켜 주세요. 알림 설정에서 권한을 변경할 수 있어요.',
    );
  }
}

export async function initializeNotificationPermissions() {
  const current = await getNotificationPermission();
  // Do not repeat the startup prompt after the user has made a choice.
  if (current.status === 'undetermined') await requestNotificationPermission();
}
