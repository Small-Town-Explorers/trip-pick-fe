import { localDataStorage } from './localDataStorage';

export { localDataStorage };

/** JSON parsing errors are reported to the caller instead of returning invalid data. */
export async function loadLocalData<T>(key: string): Promise<T | null> {
  const value = await localDataStorage.getItem(key);
  return value === null ? null : (JSON.parse(value) as T);
}

export async function saveLocalData<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new Error('저장할 수 없는 값이에요.');
  await localDataStorage.setItem(key, serialized);
}

export async function removeLocalData(key: string): Promise<void> {
  await localDataStorage.removeItem(key);
}
