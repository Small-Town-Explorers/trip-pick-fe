import { useMutation } from '@tanstack/react-query';
import { editCourseWithChat } from '../controllers';

export function useEditCourseWithChatMutation() {
  return useMutation({ mutationFn: editCourseWithChat });
}
