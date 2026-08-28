import { CourseResultScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function CourseResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <CourseResultScreen courseId={id} />;
}
