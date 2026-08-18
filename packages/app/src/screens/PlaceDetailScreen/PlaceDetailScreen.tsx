import styled from '@emotion/native';
import { PlaceDetailCourseAction } from './CourseAction';
import { PlaceDetailDiscovery } from './Discovery';
import { PlaceDetailHeader } from './Header';
import { PlaceDetailHero } from './Hero';
import { PlaceDetailLocalSights } from './LocalSights';
import { PlaceDetailTravelTips } from './TravelTips';

type Props = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: Props) {
  return (
    <Screen testID={`place-detail-${placeId}`}>
      <PlaceDetailHeader />
      <Scroll>
        <PlaceDetailHero />
        <PlaceDetailDiscovery />
        <PlaceDetailLocalSights />
        <PlaceDetailTravelTips />
        <PlaceDetailCourseAction />
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({
  position: 'relative',
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const Scroll = styled.ScrollView({
  flex: 1,
  width: '100%',
});
