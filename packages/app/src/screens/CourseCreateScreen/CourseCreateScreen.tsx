import { CourseCreateButton } from '@components/Buttons';
import { type CalendarRange } from '@components/Calendar';
import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useCallback, useState } from 'react';
import { appRoutes, useAppNavigation } from '../../navigation';
import { CourseCreateCompanion } from './Companion';
import { CourseCreateConfirm } from './Confirm';
import { CourseCreateRegion } from './Region';
import { CourseCreateTravelPeriod } from './TravelPeriod';
import { CourseCreateTravelStyle } from './TravelStyle';
import { Header } from '@components/Header';

export function CourseCreateScreen() {
  const { replace } = useAppNavigation();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [region, setRegion] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [companion, setCompanion] = useState('');
  const [period, setPeriod] = useState<CalendarRange>({});

  const createCourse = () => {
    setIsConfirmModalVisible(false);
    setIsGenerating(true);
  };

  const finishGeneration = useCallback(() => {
    replace(appRoutes.courseResult('generated'));
  }, [replace]);
  const cancelGeneration = useCallback(() => setIsGenerating(false), []);

  return (
    <Screen>
      <Header title="코스 생성" />
      <Introduction>원하는 조건의 소도시를{`\n`}추천해드려요!</Introduction>
      <CourseCreateRegion value={region} onChange={setRegion} />
      <CourseCreateTravelStyle value={styles} onChange={setStyles} />
      <CourseCreateCompanion value={companion} onChange={setCompanion} />
      <CourseCreateTravelPeriod value={period} onChange={setPeriod} />
      <Action>
        <CourseCreateButton onPress={() => setIsConfirmModalVisible(true)}>
          위 조건으로 여행 코스 만들기
        </CourseCreateButton>
      </Action>
      <CourseCreateConfirm
        visible={isConfirmModalVisible}
        region={region}
        styles={styles}
        companion={companion}
        period={period}
        onCancel={() => setIsConfirmModalVisible(false)}
        onConfirm={createCourse}
      />
      <CourseLoadingOverlay
        visible={isGenerating}
        mode="generate"
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
