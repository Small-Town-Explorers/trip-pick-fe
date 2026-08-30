import { useQuery } from '@tanstack/react-query';
import { getSmallCities } from '../controllers';

export const smallCitiesQueryKey = ['regions', 'small-cities'] as const;

export function useSmallCitiesQuery() {
  return useQuery({
    queryKey: smallCitiesQueryKey,
    queryFn: getSmallCities,
    staleTime: 5 * 60 * 1_000,
  });
}
