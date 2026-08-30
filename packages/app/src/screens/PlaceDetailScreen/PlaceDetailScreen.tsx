import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { appRoutes, useAppNavigation } from '../../navigation';
import { PlaceDetailCourseAction } from './CourseAction';
import { PlaceDetailDiscovery } from './Discovery';
import { PlaceDetailHero } from './Hero';
import { PlaceDetailLocalSights } from './LocalSights';
import { PlaceDetailTravelTips } from './TravelTips';
import { Header } from '@components/Header';
import {
  createGeneratedCourseId,
  storeGeneratedCourse,
  useGenerateCourseMutation,
} from '../../queries';

type Props = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: Props) {
  const { replace } = useAppNavigation();
  const queryClient = useQueryClient();
  const generateCourse = useGenerateCourseMutation();
  const requestSequence = useRef(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourseId, setGeneratedCourseId] = useState<string>();
  const [generationError, setGenerationError] = useState('');
  const title = '전남 담양';
  const summary = '대나무 숲의 고요한 숨결';

  const finishGeneration = useCallback(() => {
    if (generatedCourseId) replace(appRoutes.courseResult(generatedCourseId));
  }, [generatedCourseId, replace]);

  const cancelGeneration = useCallback(() => {
    requestSequence.current += 1;
    setIsGenerating(false);
  }, []);

  const createCourse = async () => {
    const sequence = ++requestSequence.current;
    setGenerationError('');
    setGeneratedCourseId(undefined);
    setIsGenerating(true);

    try {
      const course = await generateCourse.mutateAsync({ regionId: placeId });
      if (sequence !== requestSequence.current) return;
      const courseId = createGeneratedCourseId(placeId);
      storeGeneratedCourse(queryClient, courseId, course);
      setGeneratedCourseId(courseId);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setIsGenerating(false);
      setGenerationError(error instanceof Error ? error.message : '코스를 생성하지 못했어요.');
    }
  };

  return (
    <Screen testID={`place-detail-${placeId}`}>
      <Header title="숨겨진 소도시의 고요한 발견" />
      <Scroll>
        <PlaceDetailHero title={title} summary={summary} />
        <PlaceDetailDiscovery />
        <PlaceDetailLocalSights />
        <PlaceDetailTravelTips />
        {generationError ? <GenerationError>{generationError}</GenerationError> : null}
        <PlaceDetailCourseAction onCreate={createCourse} />
      </Scroll>
      <CourseLoadingOverlay
        visible={isGenerating}
        mode="generate"
        completed={Boolean(generatedCourseId)}
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

const GenerationError = styled.Text({
  paddingHorizontal: 20,
  ...typography.body3.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
