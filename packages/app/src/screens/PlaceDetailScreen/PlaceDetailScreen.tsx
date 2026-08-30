import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
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
  useRegionDetailQuery,
} from '../../queries';

type Props = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: Props) {
  const { replace } = useAppNavigation();
  const queryClient = useQueryClient();
  const { data: detail, error, isPending, refetch } = useRegionDetailQuery(placeId);
  const generateCourse = useGenerateCourseMutation();
  const requestSequence = useRef(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourseId, setGeneratedCourseId] = useState<string>();
  const [generationError, setGenerationError] = useState('');
  const title = detail?.shortName ?? '';
  const summary = detail?.summary ?? '';

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

  if (isPending) {
    return (
      <Screen testID={`place-detail-${placeId}`}>
        <Header title="숨겨진 소도시의 고요한 발견" />
        <State accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary[700]} />
          <StateText>소도시 이야기를 불러오고 있어요.</StateText>
        </State>
      </Screen>
    );
  }

  if (error || !detail) {
    return (
      <Screen testID={`place-detail-${placeId}`}>
        <Header title="숨겨진 소도시의 고요한 발견" />
        <State>
          <StateText>
            {error instanceof Error ? error.message : '소도시 상세 정보를 불러오지 못했어요.'}
          </StateText>
          <RetryButton accessibilityRole="button" onPress={() => refetch()}>
            <RetryText>다시 시도</RetryText>
          </RetryButton>
        </State>
      </Screen>
    );
  }

  return (
    <Screen testID={`place-detail-${placeId}`}>
      <Header title="숨겨진 소도시의 고요한 발견" />
      <Scroll>
        <PlaceDetailHero
          title={detail.shortName}
          summary={detail.summary}
          description={detail.description}
          tag={detail.tag}
          imageUrl={detail.imageUrl}
        />
        <PlaceDetailDiscovery discovery={detail.discovery} />
        <PlaceDetailLocalSights sights={detail.sights} />
        <PlaceDetailTravelTips tips={detail.tips} />
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
  flex: 1,
  position: 'relative',
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const State = styled.View({
  flex: 1,
  width: '100%',
  minHeight: 360,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  gap: 12,
});

const StateText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});

const RetryText = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });

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
