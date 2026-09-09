export type NotificationPermissionState = {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
};
