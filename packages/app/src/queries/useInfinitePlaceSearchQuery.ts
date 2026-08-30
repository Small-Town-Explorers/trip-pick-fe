import { useInfiniteQuery } from '@tanstack/react-query';
import { searchPlaces, type PlaceSearchSource } from '../controllers';

const PAGE_SIZE = 15;

type InfinitePlaceSearchParams = {
  keyword: string;
  source: PlaceSearchSource;
  regionId?: string;
  enabled?: boolean;
};

export function useInfinitePlaceSearchQuery({
  keyword,
  source,
  regionId,
  enabled = true,
}: InfinitePlaceSearchParams) {
  return useInfiniteQuery({
    queryKey: ['places', 'search', { keyword, source, regionId }],
    queryFn: ({ pageParam }) =>
      searchPlaces({ keyword, source, regionId, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 1,
    enabled: enabled && keyword.trim().length > 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (source === 'KAKAO' || lastPage.items.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
  });
}
