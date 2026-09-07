import { useMutation } from '@tanstack/react-query';
import { addManualCourseItem } from '../controllers';

export function useAddManualCourseItemMutation() {
  return useMutation({ mutationFn: addManualCourseItem });
}
