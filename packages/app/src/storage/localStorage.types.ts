/** Snapshot reads are available after initialize(); writes resolve after persistence. */
export interface LocalDataStorage {
  initialize(): Promise<void>;
  getItemSnapshot(key: string): string | null;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
