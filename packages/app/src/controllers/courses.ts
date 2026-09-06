import { apiRequest } from './apiClient';
import type { PlaceSearchItem } from './places';

export type GenerateCourseRequest = {
  regionId?: string;
  themes?: string[];
  terrains?: string[];
  days?: number;
  startDate?: string;
  pace?: string;
  userLat?: number;
  userLng?: number;
};

export type GenerateCourseByNameRequest = Omit<
  GenerateCourseRequest,
  'regionId' | 'userLat' | 'userLng'
> & {
  regionName: string;
  province?: string;
};

export type GeneratedCourseRegion = {
  name: string;
  province: string;
  areaCode: string;
  sigunguCode: string;
  smallCity: boolean;
  populationDeclineArea: boolean;
};

export type GeneratedCourseItem = {
  order: number;
  seatId: string;
  slot: string;
  startTime: string;
  stayMinutes: number;
  travelMinutesFromPrevious: number | null;
  contentId: string | null;
  title: string;
  contentTypeId: number;
  contentType: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
  tel: string | null;
  reason: string | null;
};

export type GeneratedCourseResponse = {
  region: GeneratedCourseRegion;
  themes: string[];
  terrains: string[];
  pace?: string | null;
  days: number;
  startDate: string | null;
  endDate: string | null;
  plan: { day: number; items: GeneratedCourseItem[] }[];
  warnings: string[];
};

export type SaveMyCourseRequest = {
  title: string;
  folderId?: string | null;
  startDate?: string | null;
  course: GeneratedCourseResponse;
};

export type MyCourseSummary = {
  id: string;
  title: string;
  folderId: string | null;
  regionName: string | null;
  areaCode: string;
  sigunguCode: string;
  days: number;
  itemCount: number;
  startDate: string | null;
  endDate: string | null;
  themes: string[];
  terrains: string[];
  createdAt: string;
};

export type MyCourseDetail = {
  id: string;
  title: string;
  folderId: string | null;
  createdAt: string;
  course: GeneratedCourseResponse;
};

export type HomeTripStatus = 'UPCOMING' | 'ONGOING' | 'NONE';

export type HomeTripItem = {
  title: string;
  lat: number | null;
  lng: number | null;
};

export type HomeTripDay = {
  day: number;
  date: string;
  items: HomeTripItem[];
};

export type HomeTrip = {
  id: string | null;
  title: string | null;
  tripStatus: HomeTripStatus;
  plan: HomeTripDay[];
};

export type AddCourseItemRequest = {
  course: GeneratedCourseResponse;
  place: PlaceSearchItem;
  day: number;
};

export type AddCourseItemResponse = {
  course: GeneratedCourseResponse;
  warnings: string[];
};

export type EditCourseWithChatRequest = {
  message: string;
  course: GeneratedCourseResponse;
};

export type EditCourseWithChatResponse = {
  reply: string;
  modified: boolean;
  course: GeneratedCourseResponse;
  warnings: string[];
};

export function generateCourse(request: GenerateCourseRequest) {
  return apiRequest<GeneratedCourseResponse>('/api/v1/courses/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function generateCourseByName(request: GenerateCourseByNameRequest) {
  return apiRequest<GeneratedCourseResponse>('/api/v1/courses/generate-by-name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function addCourseItem(request: AddCourseItemRequest) {
  return apiRequest<AddCourseItemResponse>('/api/v1/courses/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function editCourseWithChat(request: EditCourseWithChatRequest) {
  return apiRequest<EditCourseWithChatResponse>('/api/v1/courses/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function saveMyCourse(request: SaveMyCourseRequest) {
  return apiRequest<MyCourseDetail>('/api/v1/my/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function getMyCourses(folderId?: string) {
  const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : '';
  return apiRequest<MyCourseSummary[]>(`/api/v1/my/courses${query}`);
}

export function getMyCourseDetail(courseId: string) {
  return apiRequest<MyCourseDetail>(`/api/v1/my/courses/${encodeURIComponent(courseId)}`);
}

export function getHomeTrip() {
  return apiRequest<HomeTrip>('/api/v1/my/courses/home');
}
