import { useEffect, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { localDataStorage } from '../storage';
import { initializeNotificationPermissions } from '../permissions/notifications';

/** Mount consumers only after native persistence has hydrated their synchronous snapshots. */
export function LocalStorageGate({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void localDataStorage
      .initialize()
      .then(() => {
        if (!active) return;
        setReady(true);
        // Permission failures must not block access to saved trips.
        void initializeNotificationPermissions().catch(() => {});
      })
      .catch(() => {
        if (active) setError('저장된 데이터를 불러오지 못했어요. 다시 시도해 주세요.');
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  if (ready) return children;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      {error ? (
        <>
          <Text>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setError('');
              setAttempt((value) => value + 1);
            }}
          >
            <Text>다시 시도</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator />
          <Text>저장된 여행을 불러오고 있어요.</Text>
        </>
      )}
    </View>
  );
}
