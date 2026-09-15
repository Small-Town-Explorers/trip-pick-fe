import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { CalendarRange } from '../components/Calendar';
import {
  recalculateCoursePlaces,
  type CoursePlace,
  type CoursePlaces,
} from '../screens/CourseResultScreen/Routine';

const SHARED_COURSE_VERSION = 1 as const;
const DEFAULT_SHARE_BASE_URL = 'https://sodosiro.netlify.app';
const MAX_ENCODED_COURSE_LENGTH = 12_000;
const MAX_DAYS = 30;
const MAX_PLACES_PER_DAY = 30;

let shareBaseUrl = DEFAULT_SHARE_BASE_URL;

type SharedCoursePlace = {
  id: string;
  externalId: string | null;
  name: string;
  tag: string;
  summary: string;
  image: string | null;
  lat: number | null;
  lng: number | null;
};

export type SharedCourse = {
  version: typeof SHARED_COURSE_VERSION;
  title: string;
  startDate: string;
  endDate: string;
  days: SharedCoursePlace[][];
};

export type DecodedSharedCourse = {
  title: string;
  period: CalendarRange;
  places: CoursePlaces;
};

export function configureCourseShareBaseUrl(baseUrl: string | undefined) {
  if (!baseUrl) return;

  try {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
    url.pathname = url.pathname.replace(/\/$/, '');
    url.search = '';
    url.hash = '';
    shareBaseUrl = url.toString().replace(/\/$/, '');
  } catch {
    // Keep the production fallback when an environment value is malformed.
  }
}

export function createCourseShareUrl(title: string, period: CalendarRange, places: CoursePlaces) {
  const startDate = period.startDate ?? new Date().toISOString().slice(0, 10);
  const payload: SharedCourse = {
    version: SHARED_COURSE_VERSION,
    title: title.trim() || '여행 코스',
    startDate,
    endDate: period.endDate ?? startDate,
    days: places.map((day) =>
      day.map(({ id, externalId, name, tag, summary, image, lat, lng }) => ({
        id,
        externalId,
        name,
        tag,
        summary,
        image,
        lat,
        lng,
      })),
    ),
  };
  const encoded = encodeURIComponent(compressToEncodedURIComponent(JSON.stringify(payload)));

  if (encoded.length > MAX_ENCODED_COURSE_LENGTH) {
    throw new Error('코스가 너무 길어 링크로 공유할 수 없어요. 장소 수를 줄여 다시 시도해 주세요.');
  }

  return `${shareBaseUrl}/shared-course?data=${encoded}`;
}

export function decodeSharedCourse(encoded: string | null | undefined): DecodedSharedCourse | null {
  if (!encoded || encoded.length > MAX_ENCODED_COURSE_LENGTH) return null;

  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const value: unknown = JSON.parse(json);
    if (!isSharedCourse(value)) return null;

    let globalOrder = 0;
    const places = value.days.map((day, dayIndex) => {
      const date = new Date(`${value.startDate}T00:00:00`);
      date.setDate(date.getDate() + dayIndex);

      return day.map((place, placeIndex): CoursePlace => ({
        ...place,
        uid: `shared:${dayIndex}:${placeIndex}:${place.id}`,
        order: ++globalOrder,
        date,
        distanceMeters: null,
      }));
    });

    return {
      title: value.title,
      period: { startDate: value.startDate, endDate: value.endDate },
      places: recalculateCoursePlaces(places),
    };
  } catch {
    return null;
  }
}

function isSharedCourse(value: unknown): value is SharedCourse {
  if (!isRecord(value)) return false;
  if (value.version !== SHARED_COURSE_VERSION) return false;
  if (!isShortString(value.title, 100)) return false;
  if (!isDateString(value.startDate) || !isDateString(value.endDate)) return false;
  if (!Array.isArray(value.days) || value.days.length === 0 || value.days.length > MAX_DAYS) {
    return false;
  }

  return value.days.every(
    (day) =>
      Array.isArray(day) &&
      day.length <= MAX_PLACES_PER_DAY &&
      day.every((place) => isSharedCoursePlace(place)),
  );
}

function isSharedCoursePlace(value: unknown): value is SharedCoursePlace {
  if (!isRecord(value)) return false;
  return (
    isShortString(value.id, 200) &&
    isNullableString(value.externalId, 200) &&
    isShortString(value.name, 200) &&
    isString(value.tag, 100) &&
    isString(value.summary, 1_000) &&
    isNullableString(value.image, 2_000) &&
    isNullableCoordinate(value.lat, -90, 90) &&
    isNullableCoordinate(value.lng, -180, 180)
  );
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isShortString = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= maxLength;

const isString = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.length <= maxLength;

const isNullableString = (value: unknown, maxLength: number): value is string | null =>
  value === null || (typeof value === 'string' && value.length <= maxLength);

const isNullableCoordinate = (
  value: unknown,
  minimum: number,
  maximum: number,
): value is number | null =>
  value === null ||
  (typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum);

const isDateString = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
