import { useMutation, useQuery } from '@tanstack/react-query';
import { enableCourseShare, getSharedCourse } from '../controllers';

export const sharedCourseQueryKey = (shareId: string) => ['shared-courses', shareId] as const;

export function useEnableCourseShareMutation() {
  return useMutation({ mutationFn: enableCourseShare });
}

export function useSharedCourseQuery(shareId?: string) {
  return useQuery({
    queryKey: sharedCourseQueryKey(shareId ?? ''),
    queryFn: () => getSharedCourse(shareId!),
    enabled: Boolean(shareId),
    staleTime: 0,
    gcTime: 0,
  });
}
