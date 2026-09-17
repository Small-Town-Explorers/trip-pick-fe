import { useMutation } from '@tanstack/react-query';
import { recalculateCourse } from '../controllers';

export function useRecalculateCourseMutation() {
  return useMutation({ mutationFn: recalculateCourse });
}
