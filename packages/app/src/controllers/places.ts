import { apiRequest } from './apiClient';

export type PlaceSearchSource = 'TOUR' | 'KAKAO';

export type PlaceSearchItem = {
  source: PlaceSearchSource;
  externalId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string | null;
  phone: string | null;
};

export type PlaceSearchResponse = { items: PlaceSearchItem[] };

export type SearchPlacesParams = {
  keyword: string;
  source: PlaceSearchSource;
  regionId?: string;
  page?: number;
  size?: number;
};

export function searchPlaces({
  keyword,
  source,
  regionId,
  page = 1,
  size = 15,
}: SearchPlacesParams): Promise<PlaceSearchResponse> {
  const query = new URLSearchParams({
    keyword,
    source,
    page: String(page),
    size: String(size),
  });

  if (regionId) query.set('regionId', regionId);

  return apiRequest<PlaceSearchResponse>(`/api/v1/places/search?${query.toString()}`);
}
