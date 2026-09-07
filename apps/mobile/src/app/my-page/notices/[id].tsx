import { MyPageNoticeDetailScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function MyPageNoticeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <MyPageNoticeDetailScreen noticeId={id} />;
}
