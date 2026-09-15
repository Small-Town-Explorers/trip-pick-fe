import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { MyCourseDetail, MyCourseSummary } from '../controllers';
import {
  ensureNotificationPermission,
  getNotificationPermission,
} from '../permissions/notifications';
import { loadLocalData, saveLocalData } from '../storage';

type CachedCourseReminder = {
  id: string;
  title: string;
  startDate: string;
};

const COURSES_KEY = 'trip-pick:course-reminder-courses';
const SCHEDULED_IDS_KEY = 'trip-pick:course-reminder-notification-ids';
const ENABLED_KEY = 'trip-pick:course-reminders-enabled';
const NOTIFICATION_HOUR = 9;
const MAX_SCHEDULED_NOTIFICATIONS = 60;

let operations: Promise<void> = Promise.resolve();

function enqueue(operation: () => Promise<void>) {
  const result = operations.then(operation);
  operations = result.catch(() => {});
  return result;
}

const isDateString = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

function normalizeCourses(value: unknown): CachedCourseReminder[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((course) => {
    if (
      typeof course !== 'object' ||
      course === null ||
      typeof course.id !== 'string' ||
      typeof course.title !== 'string' ||
      !isDateString(course.startDate)
    ) {
      return [];
    }
    return [{ id: course.id, title: course.title, startDate: course.startDate }];
  });
}

async function loadCourses() {
  return normalizeCourses(await loadLocalData<unknown>(COURSES_KEY));
}

async function saveCourses(courses: CachedCourseReminder[]) {
  const unique = [...new Map(courses.map((course) => [course.id, course])).values()];
  await saveLocalData(COURSES_KEY, unique);
}

function fromSummary(course: MyCourseSummary): CachedCourseReminder | null {
  if (!course.startDate) return null;
  return { id: course.id, title: course.title, startDate: course.startDate };
}

function fromDetail(course: MyCourseDetail): CachedCourseReminder | null {
  if (!course.course.startDate) return null;
  return { id: course.id, title: course.title, startDate: course.course.startDate };
}

function reminderDate(startDate: string, dayOffset: number) {
  const [year, month, day] = startDate.split('-').map(Number);
  return new Date(year, month - 1, day + dayOffset, NOTIFICATION_HOUR, 0, 0, 0);
}

async function cancelPreviousSchedules() {
  const ids = (await loadLocalData<unknown>(SCHEDULED_IDS_KEY)) ?? [];
  if (Array.isArray(ids)) {
    await Promise.all(
      ids.flatMap((id) =>
        typeof id === 'string'
          ? [Notifications.cancelScheduledNotificationAsync(id).catch(() => {})]
          : [],
      ),
    );
  }
  await saveLocalData(SCHEDULED_IDS_KEY, []);
}

async function performSync() {
  await cancelPreviousSchedules();
  const enabled = (await loadLocalData<boolean>(ENABLED_KEY)) ?? true;
  const permission = await getNotificationPermission();
  if (!enabled || permission.status !== 'granted') return;
  if (typeof Notifications.scheduleNotificationAsync !== 'function') return;

  if (
    Platform.OS === 'android' &&
    typeof Notifications.setNotificationChannelAsync === 'function'
  ) {
    await Notifications.setNotificationChannelAsync('travel', {
      name: '여행 알림',
      description: '저장한 여행의 출발 전날과 당일에 알려드려요.',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const now = Date.now();
  const schedules = (await loadCourses())
    .flatMap((course) => [
      { course, date: reminderDate(course.startDate, -1), timing: 'tomorrow' as const },
      { course, date: reminderDate(course.startDate, 0), timing: 'today' as const },
    ])
    .filter(({ date }) => date.getTime() > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, MAX_SCHEDULED_NOTIFICATIONS);

  const scheduledIds: string[] = [];
  for (const { course, date, timing } of schedules) {
    const isTomorrow = timing === 'tomorrow';
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: isTomorrow
          ? `'${course.title}' 여행이 내일 시작돼요`
          : `'${course.title}' 여행이 오늘 시작돼요`,
        body: isTomorrow ? '여행 준비물을 마지막으로 확인해보세요.' : '즐거운 여행 되세요!',
        sound: true,
        data: { courseId: course.id, route: `/trip-detail/${course.id}` },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: Platform.OS === 'android' ? 'travel' : undefined,
      },
    });
    scheduledIds.push(identifier);
  }
  await saveLocalData(SCHEDULED_IDS_KEY, scheduledIds);
}

export function cacheMyCourseSummaries(courses: MyCourseSummary[], replaceAll = false) {
  return enqueue(async () => {
    const incoming = courses.flatMap((course) => {
      const reminder = fromSummary(course);
      return reminder ? [reminder] : [];
    });
    await saveCourses(replaceAll ? incoming : [...(await loadCourses()), ...incoming]);
    await performSync();
  });
}

export function cacheMyCourseDetail(course: MyCourseDetail) {
  return enqueue(async () => {
    const reminder = fromDetail(course);
    const remaining = (await loadCourses()).filter(({ id }) => id !== course.id);
    await saveCourses(reminder ? [...remaining, reminder] : remaining);
    await performSync();
  });
}

export function removeCachedMyCourse(courseId: string) {
  return enqueue(async () => {
    await saveCourses((await loadCourses()).filter(({ id }) => id !== courseId));
    await performSync();
  });
}

export function setCourseRemindersEnabled(enabled: boolean) {
  return enqueue(async () => {
    await saveLocalData(ENABLED_KEY, enabled);
    await performSync();
  });
}

export function syncCourseReminders() {
  return enqueue(performSync);
}

export function initializeCourseReminders() {
  return enqueue(async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    await performSync();
  });
}

export async function sendTestNotification() {
  await ensureNotificationPermission();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('travel', {
      name: '여행 알림',
      description: '저장한 여행의 출발 전날과 당일에 알려드려요.',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '소도시로 테스트 알림',
      body: '알림이 정상적으로 설정되었어요.',
      sound: true,
    },
    trigger: null,
  });
}
