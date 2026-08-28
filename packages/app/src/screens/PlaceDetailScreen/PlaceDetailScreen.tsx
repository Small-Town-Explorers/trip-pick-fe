import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { useCallback, useState } from 'react';
import { appRoutes, useAppNavigation } from '../../navigation';
import { PlaceDetailCourseAction } from './CourseAction';
import { PlaceDetailDiscovery } from './Discovery';
import { PlaceDetailHero } from './Hero';
import { PlaceDetailLocalSights } from './LocalSights';
import { PlaceDetailTravelTips } from './TravelTips';
import { Header } from '@components/Header';

type Props = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: Props) {
  const { replace } = useAppNavigation();
  const [isGenerating, setIsGenerating] = useState(false);
  const title = '전남 담양';
  const summary = '대나무 숲의 고요한 숨결';
  const finishGeneration = useCallback(() => {
    replace(appRoutes.courseResult('generated'));
  }, [replace]);
  const cancelGeneration = useCallback(() => setIsGenerating(false), []);

  return (
    <Screen testID={`place-detail-${placeId}`}>
      <Header title="숨겨진 소도시의 고요한 발견" />
      <Scroll>
        <PlaceDetailHero title={title} summary={summary} />
        <PlaceDetailDiscovery />
        <PlaceDetailLocalSights />
        <PlaceDetailTravelTips />
        <PlaceDetailCourseAction onCreate={() => setIsGenerating(true)} />
      </Scroll>
      <CourseLoadingOverlay
        visible={isGenerating}
        mode="generate"
        destination={`${title} : ${summary}`}
        onCancel={cancelGeneration}
        onComplete={finishGeneration}
      />
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
