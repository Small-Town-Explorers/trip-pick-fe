import type { LocalDataStorage } from './localStorage.types';

/** Browser adapter. Existing keys are preserved, so no migration is necessary. */
export const localDataStorage: LocalDataStorage = {
  async initialize() {},
  getItemSnapshot(key) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  async getItem(key) {
    return this.getItemSnapshot(key);
  },
  async setItem(key, value) {
    window.localStorage.setItem(key, value);
  },
  async removeItem(key) {
    window.localStorage.removeItem(key);
  },
};
