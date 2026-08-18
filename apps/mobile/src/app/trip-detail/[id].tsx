import { TripDetailScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function TripDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <TripDetailScreen tripId={id} />;
}
