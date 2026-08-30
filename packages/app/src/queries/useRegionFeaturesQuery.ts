import { useQuery } from '@tanstack/react-query';
import { getFeaturedRegions, getRegionDetail } from '../controllers';

export const featuredRegionsQueryKey = ['regions', 'featured'] as const;
export const regionDetailQueryKey = (regionId: string) => ['regions', 'detail', regionId] as const;

export function useFeaturedRegionsQuery() {
  return useQuery({
    queryKey: featuredRegionsQueryKey,
    queryFn: getFeaturedRegions,
    staleTime: 10 * 60 * 1_000,
  });
}

export function useRegionDetailQuery(regionId: string) {
  return useQuery({
    queryKey: regionDetailQueryKey(regionId),
    queryFn: () => getRegionDetail(regionId),
    enabled: regionId.length > 0,
    staleTime: 10 * 60 * 1_000,
  });
}
