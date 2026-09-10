import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocalDataStorage } from './localStorage.types';

const cache = new Map<string, string>();
const persisted = new Map<string, string>();
const revisions = new Map<string, number>();
let initialization: Promise<void> | undefined;
let ready = false;
let writes: Promise<void> = Promise.resolve();

// Serialize writes so an older save cannot overwrite a more recent edit or deletion.
function enqueue(write: () => Promise<void>) {
  const result = writes.then(write);
  writes = result.catch(() => {});
  return result;
}

function changeItem(key: string, value: string | null) {
  const revision = (revisions.get(key) ?? 0) + 1;
  revisions.set(key, revision);
  if (value === null) cache.delete(key);
  else cache.set(key, value);
  return enqueue(async () => {
    try {
      if (value === null) await AsyncStorage.removeItem(key);
      else await AsyncStorage.setItem(key, value);
      if (value === null) persisted.delete(key);
      else persisted.set(key, value);
    } catch (error) {
      // Only roll back the failed latest operation; never undo a newer edit.
      if (revisions.get(key) === revision) {
        const previous = persisted.get(key);
        if (previous === undefined) cache.delete(key);
        else cache.set(key, previous);
      }
      throw error;
    }
  });
}

export const localDataStorage: LocalDataStorage = {
  initialize() {
    initialization ??= (async () => {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      entries.forEach(([key, value]) => {
        if (value !== null) {
          cache.set(key, value);
          persisted.set(key, value);
        }
      });
      ready = true;
    })().catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });
    return initialization;
  },
  getItemSnapshot(key) {
    if (!ready) throw new Error('기기 저장소가 아직 준비되지 않았어요.');
    return cache.get(key) ?? null;
  },
  async getItem(key) {
    if (!ready) await this.initialize();
    await writes;
    return cache.get(key) ?? null;
  },
  async setItem(key, value) {
    if (!ready) await this.initialize();
    await changeItem(key, value);
  },
  async removeItem(key) {
    if (!ready) await this.initialize();
    await changeItem(key, null);
  },
};
