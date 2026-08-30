import { apiRequest } from './apiClient';

export type SmallCity = {
  id: string;
  name: string;
  province: string;
  population: number;
  smallCity: boolean;
  populationDeclineArea: boolean;
};

export type FeaturedRegion = {
  id: string;
  name: string;
  province: string;
  shortName: string;
  tag: string;
  summary: string;
  imageUrl: string;
};

export type RegionFeatureContent = {
  title: string;
  description: string;
  imageUrl: string;
};

export type RegionDetail = FeaturedRegion & {
  population: number;
  smallCity: boolean;
  populationDeclineArea: boolean;
  description: string;
  discovery: RegionFeatureContent;
  sights: RegionFeatureContent[];
  tips: string[];
};

export function getSmallCities(): Promise<SmallCity[]> {
  return apiRequest<SmallCity[]>('/api/v1/regions/small-cities');
}

export function getFeaturedRegions(): Promise<FeaturedRegion[]> {
  return apiRequest<FeaturedRegion[]>('/api/v1/regions/featured');
}

export function getRegionDetail(regionId: string): Promise<RegionDetail> {
  return apiRequest<RegionDetail>(`/api/v1/regions/${encodeURIComponent(regionId)}`);
}
