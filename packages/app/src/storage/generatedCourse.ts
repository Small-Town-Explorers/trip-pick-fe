import { Platform } from 'react-native';
import type { GeneratedCourseResponse } from '../controllers';

const STORAGE_PREFIX = 'trip-pick:generated-course:';

const getWebStorage = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  return window.localStorage;
};

export function persistGeneratedCourse(courseId: string, course: GeneratedCourseResponse) {
  getWebStorage()?.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(course));
}

export function getPersistedGeneratedCourse(courseId: string) {
  const storage = getWebStorage();
  const key = `${STORAGE_PREFIX}${courseId}`;
  const storedCourse = storage?.getItem(key);
  if (!storedCourse) return undefined;

  try {
    return JSON.parse(storedCourse) as GeneratedCourseResponse;
  } catch {
    storage?.removeItem(key);
    return undefined;
  }
}
