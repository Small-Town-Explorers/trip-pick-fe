import { decompressFromEncodedURIComponent } from 'lz-string';
import { inflateSync, strFromU8 } from 'fflate';
import type { CalendarRange } from '../components/Calendar';
import {
  recalculateCoursePlaces,
  type CoursePlace,
  type CoursePlaces,
} from '../screens/CourseResultScreen/Routine';

const SHARED_COURSE_VERSION = 3 as const;
const DEFAULT_SHARE_BASE_URL = 'https://sodosiro.netlify.app';
const MAX_ENCODED_COURSE_LENGTH = 12_000;
const MAX_DAYS = 30;
const MAX_PLACES_PER_DAY = 30;

let shareBaseUrl = DEFAULT_SHARE_BASE_URL;

type SharedCoursePlaceV1 = {
  id: string;
  externalId: string | null;
  name: string;
  tag: string;
  summary: string;
  image: string | null;
  lat: number | null;
  lng: number | null;
};

type SharedCourseV1 = {
  version: 1;
  title: string;
  startDate: string;
  endDate: string;
  days: SharedCoursePlaceV1[][];
};

type SharedCoursePlaceV2 = [
  source: 0 | 1 | 2,
  externalId: string | null,
  name: string,
  tag: string,
  summary: string,
  lat: number | null,
  lng: number | null,
];

type SharedCourseV2 = [
  version: 2,
  title: string,
  startDate: string,
  endDate: string,
  days: SharedCoursePlaceV2[][],
];

type SharedCoursePlaceV3 = [
  source: string | 0 | null,
  name: string,
  tag: string,
  summary: string,
  lat: number | null,
  lng: number | null,
];

type SharedCourseV3 = [
  version: typeof SHARED_COURSE_VERSION,
  title: string,
  startDate: string,
  endOffset: number,
  days: SharedCoursePlaceV3[][],
];

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

export function createCourseShareUrl(shareId: string) {
  return `${shareBaseUrl}/c/${encodeURIComponent(shareId)}`;
}

export function decodeSharedCourse(encoded: string | null | undefined): DecodedSharedCourse | null {
  if (!encoded || encoded.length > MAX_ENCODED_COURSE_LENGTH) return null;

  try {
    const json = encoded.startsWith('~')
      ? strFromU8(inflateSync(fromBase64Url(encoded.slice(1))))
      : decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const value: unknown = JSON.parse(json);
    const normalized = normalizeSharedCourse(value);
    if (!normalized) return null;

    let globalOrder = 0;
    const places = normalized.days.map((day, dayIndex) => {
      const date = new Date(`${normalized.startDate}T00:00:00`);
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
      title: normalized.title,
      period: { startDate: normalized.startDate, endDate: normalized.endDate },
      places: recalculateCoursePlaces(places),
    };
  } catch {
    return null;
  }
}

function normalizeSharedCourse(value: unknown): Omit<SharedCourseV1, 'version'> | null {
  if (isSharedCourseV3(value)) {
    const [, title, compactStartDate, endOffset, days] = value;
    const startDate = expandDate(compactStartDate);
    return {
      title,
      startDate,
      endDate: addDateDays(startDate, endOffset),
      days: days.map((day, dayIndex) =>
        day.map(([source, name, tag, summary, lat, lng], placeIndex) => {
          const externalId = typeof source === 'string' ? source : null;
          return {
            id:
              typeof source === 'string'
                ? `KAKAO:${externalId}`
                : source === 0
                  ? `TOUR:${dayIndex}:${placeIndex}`
                  : `FREE_TIME:${dayIndex + 1}:${placeIndex + 1}`,
            externalId,
            name,
            tag,
            summary,
            image: null,
            lat: decodeCoordinate(lat),
            lng: decodeCoordinate(lng),
          };
        }),
      ),
    };
  }

  if (isSharedCourseV2(value)) {
    const [, title, startDate, endDate, days] = value;
    return {
      title,
      startDate,
      endDate,
      days: days.map((day, dayIndex) =>
        day.map(([source, externalId, name, tag, summary, lat, lng], placeIndex) => ({
          id:
            source === 1
              ? `KAKAO:${externalId}`
              : source === 2
                ? `TOUR:${externalId}`
                : `FREE_TIME:${dayIndex + 1}:${placeIndex + 1}`,
          externalId,
          name,
          tag,
          summary,
          image: null,
          lat,
          lng,
        })),
      ),
    };
  }

  return isSharedCourseV1(value) ? value : null;
}

function isSharedCourseV1(value: unknown): value is SharedCourseV1 {
  if (!isRecord(value)) return false;
  if (value.version !== 1) return false;
  if (!isShortString(value.title, 100)) return false;
  if (!isDateString(value.startDate) || !isDateString(value.endDate)) return false;
  if (!Array.isArray(value.days) || value.days.length === 0 || value.days.length > MAX_DAYS) {
    return false;
  }

  return value.days.every(
    (day) =>
      Array.isArray(day) &&
      day.length <= MAX_PLACES_PER_DAY &&
      day.every((place) => isSharedCoursePlaceV1(place)),
  );
}

function isSharedCoursePlaceV1(value: unknown): value is SharedCoursePlaceV1 {
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

function isSharedCourseV2(value: unknown): value is SharedCourseV2 {
  if (!Array.isArray(value) || value.length !== 5 || value[0] !== 2) {
    return false;
  }
  if (!isShortString(value[1], 100)) return false;
  if (!isDateString(value[2]) || !isDateString(value[3])) return false;
  if (!Array.isArray(value[4]) || value[4].length === 0 || value[4].length > MAX_DAYS) {
    return false;
  }

  return value[4].every(
    (day) =>
      Array.isArray(day) &&
      day.length <= MAX_PLACES_PER_DAY &&
      day.every((place) => isSharedCoursePlaceV2(place)),
  );
}

function isSharedCourseV3(value: unknown): value is SharedCourseV3 {
  if (!Array.isArray(value) || value.length !== 5 || value[0] !== SHARED_COURSE_VERSION) {
    return false;
  }
  if (!isShortString(value[1], 100) || !/^\d{8}$/.test(value[2])) return false;
  if (!Number.isInteger(value[3]) || value[3] < 0 || value[3] > MAX_DAYS - 1) return false;
  if (!Array.isArray(value[4]) || value[4].length === 0 || value[4].length > MAX_DAYS) {
    return false;
  }

  return value[4].every(
    (day) =>
      Array.isArray(day) &&
      day.length <= MAX_PLACES_PER_DAY &&
      day.every((place) => isSharedCoursePlaceV3(place)),
  );
}

function isSharedCoursePlaceV3(value: unknown): value is SharedCoursePlaceV3 {
  return (
    Array.isArray(value) &&
    value.length === 6 &&
    (value[0] === null || value[0] === 0 || isString(value[0], 200)) &&
    isShortString(value[1], 200) &&
    isString(value[2], 100) &&
    isString(value[3], 500) &&
    isNullableInteger(value[4], -9_000_000, 9_000_000) &&
    isNullableInteger(value[5], -18_000_000, 18_000_000)
  );
}

function isSharedCoursePlaceV2(value: unknown): value is SharedCoursePlaceV2 {
  return (
    Array.isArray(value) &&
    value.length === 7 &&
    (value[0] === 0 || value[0] === 1 || value[0] === 2) &&
    isNullableString(value[1], 200) &&
    isShortString(value[2], 200) &&
    isString(value[3], 100) &&
    isString(value[4], 500) &&
    isNullableCoordinate(value[5], -90, 90) &&
    isNullableCoordinate(value[6], -180, 180)
  );
}

const decodeCoordinate = (value: number | null) => (value === null ? null : value / 100_000);

const addDateDays = (dateString: string, days: number) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const expandDate = (value: string) =>
  `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;

const BASE64_URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function fromBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) {
    throw new Error('Invalid base64url');
  }

  const bytes = new Uint8Array(Math.floor((value.length * 6) / 8));
  let byteIndex = 0;
  let bitBuffer = 0;
  let bitCount = 0;
  for (const character of value) {
    bitBuffer = (bitBuffer << 6) | BASE64_URL_ALPHABET.indexOf(character);
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      bytes[byteIndex++] = (bitBuffer >>> bitCount) & 255;
    }
  }
  return bytes;
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

const isNullableInteger = (
  value: unknown,
  minimum: number,
  maximum: number,
): value is number | null =>
  value === null ||
  (typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum);

const isDateString = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
