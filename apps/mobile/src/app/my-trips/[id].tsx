import { MyTripFolderScreen } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function MyTripFolderRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return id ? <MyTripFolderScreen folderId={id} /> : null;
}
