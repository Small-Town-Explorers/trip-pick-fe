import { MyPageSectionScreen, type MyPageSection } from '@trip-pick/app';
import { useLocalSearchParams } from 'expo-router';

export default function MyPageSectionRoute() {
  const { section } = useLocalSearchParams<{ section: MyPageSection }>();
  return section ? <MyPageSectionScreen section={section} /> : null;
}
