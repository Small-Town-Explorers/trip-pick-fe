import { SharedCourseScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function SharedCourseIdRoute() {
  const { shareId } = useLocalSearchParams<{ shareId?: string | string[] }>();
  const resolvedShareId = Array.isArray(shareId) ? shareId[0] : shareId;

  return <SharedCourseScreen shareId={resolvedShareId} />;
}
