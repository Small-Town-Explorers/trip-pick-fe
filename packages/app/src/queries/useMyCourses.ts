import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMyCourse,
  getHomeTrip,
  getMyCourseDetail,
  getMyCourses,
  saveMyCourse,
  updateMyCourse,
  type MyCourseDetail,
  type MyCourseSummary,
} from '../controllers';
import { myPageSummaryQueryKey } from './useMyPageQueries';

export const myCourseListsQueryKey = ['my-courses', 'list'] as const;
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

export function useHomeTripQuery(enabled = true) {
  return useQuery({
    queryKey: homeTripQueryKey,
    queryFn: getHomeTrip,
    enabled,
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

export function useUpdateMyCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyCourse,
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData<MyCourseDetail>(
        myCourseDetailQueryKey(updatedCourse.id),
        updatedCourse,
      );
      void queryClient.invalidateQueries({ queryKey: myCourseListsQueryKey });
      void queryClient.invalidateQueries({ queryKey: homeTripQueryKey });
      void queryClient.invalidateQueries({ queryKey: myPageSummaryQueryKey });
    },
  });
}

export function useDeleteMyCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyCourse,
    onSuccess: (_response, courseId) => {
      queryClient.setQueriesData<MyCourseSummary[]>(
        { queryKey: myCourseListsQueryKey },
        (courses) => courses?.filter((course) => course.id !== courseId),
      );
      queryClient.removeQueries({ queryKey: myCourseDetailQueryKey(courseId), exact: true });
      void queryClient.invalidateQueries({ queryKey: myCourseListsQueryKey });
      void queryClient.invalidateQueries({ queryKey: homeTripQueryKey });
      void queryClient.invalidateQueries({ queryKey: myPageSummaryQueryKey });
    },
  });
}
