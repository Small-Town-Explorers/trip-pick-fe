import { apiRequest } from './apiClient';

export type SmallCity = {
  id: string;
  name: string;
  province: string;
  population: number;
  smallCity: boolean;
  populationDeclineArea: boolean;
};

export function getSmallCities(): Promise<SmallCity[]> {
  return apiRequest<SmallCity[]>('/api/v1/regions/small-cities');
}
