import { PlaceDetailScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function PlaceDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <PlaceDetailScreen placeId={id} />;
}
