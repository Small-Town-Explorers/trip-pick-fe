import { useMutation, type QueryClient } from '@tanstack/react-query';
import { generateCourse, generateCourseByName, type GeneratedCourseResponse } from '../controllers';
import { persistGeneratedCourse } from '../storage/generatedCourse';

export const generatedCourseQueryKey = (courseId: string) => ['courses', 'generated', courseId];

export function useGenerateCourseMutation() {
  return useMutation({ mutationFn: generateCourse });
}

export function useGenerateCourseByNameMutation() {
  return useMutation({ mutationFn: generateCourseByName });
}

export function createGeneratedCourseId(regionId?: string) {
  return `${regionId ?? 'recommended'}-${Date.now()}`;
}

export function storeGeneratedCourse(
  queryClient: QueryClient,
  courseId: string,
  course: GeneratedCourseResponse,
) {
  queryClient.setQueryData(generatedCourseQueryKey(courseId), course);
  persistGeneratedCourse(courseId, course);
}
