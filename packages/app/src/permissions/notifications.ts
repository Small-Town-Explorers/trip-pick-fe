import type { NotificationPermissionState } from './notifications.types';

export async function getNotificationPermission(): Promise<NotificationPermissionState> {
  return { status: 'granted', canAskAgain: false };
}
export const requestNotificationPermission = getNotificationPermission;
export async function ensureNotificationPermission(): Promise<void> {}
export async function initializeNotificationPermissions(): Promise<void> {}
