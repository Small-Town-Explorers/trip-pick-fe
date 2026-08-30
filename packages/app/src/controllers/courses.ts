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
  days: number;
  startDate: string | null;
  endDate: string | null;
  plan: { day: number; items: GeneratedCourseItem[] }[];
  warnings: string[];
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
