import { Platform } from 'react-native';

export interface CourseSaveNotice {
  title: string;
}

const STORAGE_KEY = 'trip-pick:course-save-complete';
const listeners = new Set<() => void>();
let memoryNotice: CourseSaveNotice | null = null;

const getWebStorage = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  return window.localStorage;
};

export const setCourseSaveNotice = (notice: CourseSaveNotice) => {
  memoryNotice = notice;
  getWebStorage()?.setItem(STORAGE_KEY, JSON.stringify(notice));
  listeners.forEach((listener) => listener());
};

export const takeCourseSaveNotice = () => {
  let notice = memoryNotice;
  const storage = getWebStorage();
  const storedNotice = storage?.getItem(STORAGE_KEY);

  if (!notice && storedNotice) {
    try {
      notice = JSON.parse(storedNotice) as CourseSaveNotice;
    } catch {
      notice = null;
    }
  }

  memoryNotice = null;
  storage?.removeItem(STORAGE_KEY);
  return notice;
};

export const subscribeCourseSaveNotice = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
