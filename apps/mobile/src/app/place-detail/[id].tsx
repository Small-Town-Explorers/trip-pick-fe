import { PlaceDetailScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function PlaceDetailRoute() {
  const { id, discoveryTitle } = useLocalSearchParams<{
    id: string;
    discoveryTitle?: string;
  }>();

  if (!id) {
    return null;
  }

  return <PlaceDetailScreen placeId={id} discoveryTitle={discoveryTitle} />;
}
