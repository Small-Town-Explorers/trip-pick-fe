import type { MyCourseDetail, MyCourseSummary } from '../controllers';

export async function cacheMyCourseSummaries(
  _courses: MyCourseSummary[],
  _replaceAll = false,
): Promise<void> {}

export async function cacheMyCourseDetail(_course: MyCourseDetail): Promise<void> {}
export async function removeCachedMyCourse(_courseId: string): Promise<void> {}
export async function setCourseRemindersEnabled(_enabled: boolean): Promise<void> {}
export async function syncCourseReminders(): Promise<void> {}
export async function initializeCourseReminders(): Promise<void> {}
export async function sendTestNotification(): Promise<void> {
  throw new Error('테스트 알림은 모바일 앱에서만 보낼 수 있어요.');
}
