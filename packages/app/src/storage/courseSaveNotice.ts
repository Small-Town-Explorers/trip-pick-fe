import { localDataStorage } from './localDataStorage';

export interface CourseSaveNotice {
  title: string;
}

const STORAGE_KEY = 'trip-pick:course-save-complete';
const listeners = new Set<() => void>();
let memoryNotice: CourseSaveNotice | null = null;

export const setCourseSaveNotice = async (notice: CourseSaveNotice) => {
  memoryNotice = notice;
  // The server save has already succeeded; failure to persist a toast must not
  // turn that success into a retryable save error (which could create duplicates).
  await localDataStorage.setItem(STORAGE_KEY, JSON.stringify(notice)).catch(() => {});
  listeners.forEach((listener) => listener());
};

export const takeCourseSaveNotice = () => {
  let notice = memoryNotice;
  const storedNotice = localDataStorage.getItemSnapshot(STORAGE_KEY);

  if (!notice && storedNotice) {
    try {
      const parsed: unknown = JSON.parse(storedNotice);
      notice =
        parsed &&
        typeof parsed === 'object' &&
        'title' in parsed &&
        typeof parsed.title === 'string'
          ? { title: parsed.title }
          : null;
    } catch {
      notice = null;
    }
  }

  memoryNotice = null;
  void localDataStorage.removeItem(STORAGE_KEY).catch(() => {});
  return notice;
};

export const subscribeCourseSaveNotice = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
