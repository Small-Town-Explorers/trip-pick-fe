import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Pressable, Text, View } from 'react-native';
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../../permissions/notifications';
import type { NotificationPermissionState } from '../../permissions/notifications.types';

export function NotificationPermissionCard() {
  const [permission, setPermission] = useState<NotificationPermissionState>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(() => {
    void getNotificationPermission()
      .then(setPermission)
      .catch(() => setError('알림 권한을 확인하지 못했어요.'));
  }, []);
  useEffect(() => {
    refresh();
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => listener.remove();
  }, [refresh]);

  const changePermission = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      if (permission?.status !== 'granted' && permission?.canAskAgain) {
        setPermission(await requestNotificationPermission());
      } else {
        await Linking.openSettings();
      }
    } catch {
      setError('알림 권한을 변경하지 못했어요. 휴대폰 설정에서 확인해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12, borderRadius: 12, backgroundColor: '#FFFFFF' }}>
      <Text accessibilityLiveRegion="polite" style={{ color: '#155744' }}>
        휴대폰 알림 권한:{' '}
        {permission ? (permission.status === 'granted' ? '허용됨' : '허용되지 않음') : '확인 중'}
      </Text>
      <Text style={{ color: '#666' }}>
        휴대폰 권한과 아래 수신 설정이 모두 켜져 있어야 알림을 받을 수 있어요.
      </Text>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void changePermission()}
        style={{ paddingVertical: 10 }}
      >
        <Text style={{ color: '#155744' }}>
          {busy
            ? '확인 중…'
            : permission?.status !== 'granted' && permission?.canAskAgain
              ? '알림 권한 허용'
              : '휴대폰 알림 설정 열기'}
        </Text>
      </Pressable>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={{ color: '#B42318' }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
