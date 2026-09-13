import { CourseCreateButton } from '@components/Buttons';
import { type CalendarRange } from '@components/Calendar';
import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { appRoutes, useAppNavigation } from '../../navigation';
import { CourseCreateCompanion } from './Companion';
import { CourseCreateConfirm } from './Confirm';
import { CourseCreateRegion } from './Region';
import { CourseCreateTravelPeriod } from './TravelPeriod';
import { CourseCreateTravelStyle } from './TravelStyle';
import { Header } from '@components/Header';
import {
  createGeneratedCourseId,
  storeGeneratedCourse,
  useGenerateCourseMutation,
  useSmallCitiesQuery,
} from '../../queries';
import type { GenerateCourseRequest, SmallCity } from '../../controllers';
import { CourseCreateDensity } from './Density';
import { TmpLoadingAnimated } from '@components/CourseLoadingOverlay/TmpLoadingAnimated';

export function CourseCreateScreen() {
  const { replace } = useAppNavigation();
  const queryClient = useQueryClient();
  const generateCourse = useGenerateCourseMutation();
  const requestSequence = useRef(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [region, setRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState<SmallCity>();
  const [density, setDensity] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [companion, setCompanion] = useState('');
  const [period, setPeriod] = useState<CalendarRange>({});
  const [generatedCourseId, setGeneratedCourseId] = useState<string>();
  const [generationError, setGenerationError] = useState('');
  const {
    data: smallCities = [],
    isPending: isLoadingRegions,
    isError: isRegionError,
  } = useSmallCitiesQuery();

  const createCourse = async () => {
    setIsConfirmModalVisible(false);
    setGenerationError('');
    setGeneratedCourseId(undefined);

    const exactCity = selectedCity ?? smallCities.find((city) => city.name === region.trim());
    const terrains =
      region === '산 · 숲'
        ? ['산']
        : region === '바다 · 강'
          ? ['바다']
          : region === '수도권 근교'
            ? ['근교']
            : [];
    const randomCity =
      region === '랜덤' && smallCities.length > 0
        ? smallCities[Math.floor(Math.random() * smallCities.length)]
        : undefined;
    const regionId = exactCity?.id ?? randomCity?.id;

    if (!regionId && terrains.length === 0) {
      setGenerationError('목록에서 지역을 선택하거나 원하는 지형을 골라 주세요.');
      return;
    }

    if (terrains.includes('근교')) {
      setGenerationError('근교 추천은 현재 위치 연결 후 사용할 수 있어요.');
      return;
    }

    const themes = styles.map((style) => (style === '문화 · 역사' ? '문화역사' : style));
    const days = getTripDays(period);
    const request: GenerateCourseRequest = {
      ...(regionId ? { regionId } : {}),
      ...(themes.length ? { themes } : {}),
      ...(terrains.length ? { terrains } : {}),
      ...(days ? { days } : {}),
      ...(period.startDate ? { startDate: period.startDate } : {}),
      ...(density ? { pace: density } : {}),
    };
    const sequence = ++requestSequence.current;
    setIsGenerating(true);

    try {
      const course = await generateCourse.mutateAsync(request);
      if (sequence !== requestSequence.current) return;
      const courseId = createGeneratedCourseId(regionId);
      await storeGeneratedCourse(queryClient, courseId, course);
      if (sequence !== requestSequence.current) return;
      setGeneratedCourseId(courseId);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setIsGenerating(false);
      setGenerationError(error instanceof Error ? error.message : '코스를 생성하지 못했어요.');
    }
  };

  const finishGeneration = useCallback(() => {
    if (generatedCourseId) replace(appRoutes.courseResult(generatedCourseId));
  }, [generatedCourseId, replace]);
  const cancelGeneration = useCallback(() => {
    requestSequence.current += 1;
    setIsGenerating(false);
  }, []);

  return (
    <Screen>
      <Header title="코스 생성" />
      <Introduction>원하는 조건의 소도시를{`\n`}추천해드려요!</Introduction>
      <CourseCreateRegion
        value={region}
        cities={smallCities}
        isLoading={isLoadingRegions}
        errorMessage={isRegionError ? '지역 목록을 불러오지 못했어요.' : ''}
        onChange={(value) => {
          setSelectedCity(undefined);
          setRegion(value);
        }}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setRegion(city.name);
        }}
      />
      <CourseCreateDensity value={density} onChange={setDensity} />
      <CourseCreateTravelStyle value={styles} onChange={setStyles} />
      <CourseCreateCompanion
        value={companion}
        onChange={(value) => setCompanion((prev) => (prev === value ? '' : value))}
      />
      <CourseCreateTravelPeriod value={period} onChange={setPeriod} />
      <Action>
        <CourseCreateButton
          disabled={!Boolean(selectedCity?.name ?? region)}
          onPress={() => setIsConfirmModalVisible(true)}
        >
          위 조건으로 여행 코스 만들기
        </CourseCreateButton>
      </Action>
      {generationError ? <GenerationError>{generationError}</GenerationError> : null}
      <CourseCreateConfirm
        visible={isConfirmModalVisible}
        region={region}
        density={density}
        styles={styles}
        companion={companion}
        period={period}
        onCancel={() => setIsConfirmModalVisible(false)}
        onConfirm={createCourse}
      />
      <CourseLoadingOverlay
        visible={isGenerating}
        mode="generate"
        completed={Boolean(generatedCourseId)}
        destination={selectedCity?.name ?? region}
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
  minHeight: '100%',
  backgroundColor: '#FFFFFF',
});

const Introduction = styled.Text({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const Action = styled.View({
  left: 0,
  right: 0,
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
});

const GenerationError = styled.Text({
  paddingHorizontal: 20,
  paddingBottom: 16,
  ...typography.body3.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});

function getTripDays(period: CalendarRange) {
  if (!period.startDate) return undefined;
  if (!period.endDate) return 1;

  const start = new Date(`${period.startDate}T00:00:00Z`).getTime();
  const end = new Date(`${period.endDate}T00:00:00Z`).getTime();
  return Math.min(3, Math.max(1, Math.round((end - start) / 86_400_000) + 1));
}
