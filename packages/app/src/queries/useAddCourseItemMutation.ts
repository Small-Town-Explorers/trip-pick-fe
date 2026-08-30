import { useMutation } from '@tanstack/react-query';
import { addCourseItem } from '../controllers';

export function useAddCourseItemMutation() {
  return useMutation({ mutationFn: addCourseItem });
}
