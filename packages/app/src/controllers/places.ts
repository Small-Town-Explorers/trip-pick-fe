import { apiRequest } from './apiClient';

export type PlaceSearchSource = 'TOUR' | 'KAKAO';

export type PlaceSearchItem = {
  source: PlaceSearchSource;
  externalId: string;
  contentTypeId: number | null;
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
  regionId: string;
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
    regionId,
    page: String(page),
    size: String(size),
  });

  return apiRequest<PlaceSearchResponse>(`/api/v1/places/search?${query.toString()}`);
}
