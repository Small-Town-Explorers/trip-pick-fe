import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyCourseDetail, getMyCourses, saveMyCourse, type MyCourseDetail } from '../controllers';

const myCourseListsQueryKey = ['my-courses', 'list'] as const;

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

export function useSaveMyCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMyCourse,
    onSuccess: (savedCourse) => {
      queryClient.setQueryData<MyCourseDetail>(myCourseDetailQueryKey(savedCourse.id), savedCourse);
      void queryClient.invalidateQueries({ queryKey: myCourseListsQueryKey });
    },
  });
}
