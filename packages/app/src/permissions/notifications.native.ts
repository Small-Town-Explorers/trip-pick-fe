import Constants, { AppOwnership } from 'expo-constants';
import { Platform } from 'react-native';
import type { NotificationPermissionState } from './notifications.types';

type NotificationsModule = typeof import('expo-notifications');
type NotificationPermissionsStatus = Awaited<
  ReturnType<NotificationsModule['getPermissionsAsync']>
>;

let pendingRequest: Promise<NotificationPermissionState> | undefined;
let notificationsModule: Promise<NotificationsModule | null> | undefined;

const unsupportedPermission: NotificationPermissionState = {
  status: 'denied',
  canAskAgain: false,
};

/** Expo Go no longer includes Android remote notifications, so load them only when available. */
function getNotificationsModule() {
  if (Constants.appOwnership === AppOwnership.Expo) return Promise.resolve(null);
  notificationsModule ??= import('expo-notifications').catch(() => null);
  return notificationsModule;
}

function normalize(
  permission: NotificationPermissionsStatus,
  Notifications: NotificationsModule,
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
  const Notifications = await getNotificationsModule();
  if (!Notifications) return unsupportedPermission;
  return normalize(await Notifications.getPermissionsAsync(), Notifications);
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return unsupportedPermission;
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
      Notifications,
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
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  const current = await getNotificationPermission();
  // Do not repeat the startup prompt after the user has made a choice.
  if (current.status === 'undetermined') await requestNotificationPermission();
}
