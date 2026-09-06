import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getHomeTrip,
  getMyCourseDetail,
  getMyCourses,
  saveMyCourse,
  type MyCourseDetail,
} from '../controllers';

const myCourseListsQueryKey = ['my-courses', 'list'] as const;
export const homeTripQueryKey = ['my-courses', 'home'] as const;

export const myCoursesQueryKey = (folderId?: string) =>
  [...myCourseListsQueryKey, folderId ?? 'all'] as const;

export const myCourseDetailQueryKey = (courseId: string) =>
  ['my-courses', 'detail', courseId] as const;

export function useMyCoursesQuery(folderId?: string) {
  return useQuery({
    queryKey: myCoursesQueryKey(folderId),
    queryFn: () => getMyCourses(folderId),
  });
}

export function useMyCourseDetailQuery(courseId: string, enabled = true) {
  return useQuery({
    queryKey: myCourseDetailQueryKey(courseId),
    queryFn: () => getMyCourseDetail(courseId),
    enabled: enabled && Boolean(courseId),
  });
}

export function useHomeTripQuery() {
  return useQuery({
    queryKey: homeTripQueryKey,
    queryFn: getHomeTrip,
    staleTime: 60_000,
  });
}

export function useSaveMyCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMyCourse,
    onSuccess: (savedCourse) => {
      queryClient.setQueryData<MyCourseDetail>(myCourseDetailQueryKey(savedCourse.id), savedCourse);
      void queryClient.invalidateQueries({ queryKey: myCourseListsQueryKey });
      void queryClient.invalidateQueries({ queryKey: homeTripQueryKey });
    },
  });
}
