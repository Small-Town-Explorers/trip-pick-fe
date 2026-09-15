import { SharedCourseScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function SharedCourseRoute() {
  const { data } = useLocalSearchParams<{ data?: string | string[] }>();
  const encodedCourse = Array.isArray(data) ? data[0] : data;

  return <SharedCourseScreen encodedCourse={encodedCourse} />;
}
