import { localDataStorage } from './localDataStorage';
import type { GeneratedCourseResponse } from '../controllers';

const STORAGE_PREFIX = 'trip-pick:generated-course:';

export function persistGeneratedCourse(courseId: string, course: GeneratedCourseResponse) {
  return localDataStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(course));
}

export function getPersistedGeneratedCourse(courseId: string) {
  const key = `${STORAGE_PREFIX}${courseId}`;
  const storedCourse = localDataStorage.getItemSnapshot(key);
  if (!storedCourse) return undefined;

  try {
    return JSON.parse(storedCourse) as GeneratedCourseResponse;
  } catch {
    void localDataStorage.removeItem(key).catch(() => {});
    return undefined;
  }
}
