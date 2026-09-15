import { SharedCourseScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function CompactSharedCourseRoute() {
  const { d } = useLocalSearchParams<{ d?: string | string[] }>();
  const encodedCourse = Array.isArray(d) ? d[0] : d;

  return <SharedCourseScreen encodedCourse={encodedCourse} />;
}
