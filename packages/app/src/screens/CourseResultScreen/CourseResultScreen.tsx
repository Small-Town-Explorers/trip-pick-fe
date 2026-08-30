import { type CalendarRange } from '@components/Calendar';
import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { useCallback, useRef, useState } from 'react';
import { useAppNavigation } from '../../navigation';
import { setCourseSaveNotice } from '../../storage/courseSaveNotice';
import { TripDetailActions } from '../TripDetailScreen/Bottom';
import { CourseResultEditActions } from './EditActions';
import { CourseResultChatModal } from './ChatModal';
import { CourseResultDirectPlaceModal } from './DirectPlaceModal';
import { CourseResultMap } from './Map';
import { CourseResultRegenerateModal } from './RegenerateModal';
import {
  CourseResultRoutine,
  createCoursePlacesFromResponse,
  recalculateCoursePlaces,
  type CoursePlaces,
} from './Routine';
import { CourseResultScheduleModal } from './ScheduleModal';
import { CourseResultShareModal } from './ShareModal';
import { CourseResultPlaceSearchModal } from './PlaceSearchModal';
import { CourseResultSaveModal } from './SaveModal';
import { type CoursePlaceInput } from './types';
import { Header } from '@components/Header';
import { IconComponent } from '@components/Icons';
import { colors } from '@styles';
import { useQueryClient } from '@tanstack/react-query';
import type { GeneratedCourseResponse } from '../../controllers';
import {
  generatedCourseQueryKey,
  storeGeneratedCourse,
  useGenerateCourseByNameMutation,
} from '../../queries';
import { getPersistedGeneratedCourse } from '../../storage/generatedCourse';

interface CourseResultScreenProps {
  courseId: string;
}

const getGeneratedCoursePeriod = (course: GeneratedCourseResponse): CalendarRange => {
  if (course.startDate) {
    return {
      startDate: course.startDate,
      endDate: course.endDate ?? course.startDate,
    };
  }

  const start = new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + Math.max(0, course.days - 1));

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  };
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultPeriod = (): CalendarRange => {
  const today = formatDateInput(new Date());
  return { startDate: today, endDate: today };
};

const getPeriodDays = ({ startDate, endDate }: CalendarRange) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
};

export function CourseResultScreen({ courseId }: CourseResultScreenProps) {
  const { back } = useAppNavigation();
  const queryClient = useQueryClient();
  const initialGeneratedCourse =
    queryClient.getQueryData<GeneratedCourseResponse>(generatedCourseQueryKey(courseId)) ??
    getPersistedGeneratedCourse(courseId);
  const [course, setCourse] = useState(initialGeneratedCourse);
  const regenerateMutation = useGenerateCourseByNameMutation();
  const regenerationSequence = useRef(0);
  const [title, setTitle] = useState(() =>
    initialGeneratedCourse
      ? `${initialGeneratedCourse.region.province} ${initialGeneratedCourse.region.name} 여행`
      : '여행 코스',
  );
  const [period, setPeriod] = useState<CalendarRange>(() =>
    initialGeneratedCourse ? getGeneratedCoursePeriod(initialGeneratedCourse) : getDefaultPeriod(),
  );
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isRegenerateVisible, setIsRegenerateVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isPlaceSearchVisible, setIsPlaceSearchVisible] = useState(false);
  const [isDirectPlaceVisible, setIsDirectPlaceVisible] = useState(false);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isRegenerationComplete, setIsRegenerationComplete] = useState(false);
  const [regenerationError, setRegenerationError] = useState('');
  const [resultVersion, setResultVersion] = useState(0);
  const [places, setPlaces] = useState<CoursePlaces>(() =>
    initialGeneratedCourse ? createCoursePlacesFromResponse(initialGeneratedCourse) : [],
  );

  const closeModals = () => {
    setIsScheduleVisible(false);
    setIsShareVisible(false);
    setIsRegenerateVisible(false);
    setIsChatVisible(false);
    setIsPlaceSearchVisible(false);
    setIsDirectPlaceVisible(false);
    setIsSaveVisible(false);
  };

  const addPlaces = (newPlaces: CoursePlaceInput[]) => {
    setPlaces((days) => {
      const orderStart = days.flat().length;
      const addedAt = Date.now();
      const lastDate =
        days.at(-1)?.[0]?.date ?? new Date(period.endDate ?? period.startDate ?? '2026-09-05');
      const additions = newPlaces.map((place, index) => ({
        ...place,
        date: lastDate,
        distanceMeters: null,
        uid: `added-${addedAt}-${index}`,
        order: orderStart + index + 1,
      }));
      if (days.length === 0) return recalculateCoursePlaces([additions]);

      return recalculateCoursePlaces(
        days.map((day, index) => (index === days.length - 1 ? [...day, ...additions] : day)),
      );
    });
  };

  const regenerateCourse = async () => {
    closeModals();
    setRegenerationError('');
    setIsRegenerationComplete(false);

    if (!course) {
      setRegenerationError('기존 코스 정보를 찾을 수 없어 다시 생성할 수 없어요.');
      return;
    }

    const sequence = ++regenerationSequence.current;
    setIsRegenerating(true);

    try {
      const regeneratedCourse = await regenerateMutation.mutateAsync({
        regionName: course.region.name,
        province: course.region.province,
        days: getPeriodDays(period),
        ...(period.startDate ? { startDate: period.startDate } : {}),
      });
      if (sequence !== regenerationSequence.current) return;

      storeGeneratedCourse(queryClient, courseId, regeneratedCourse);
      setCourse(regeneratedCourse);
      setPlaces(createCoursePlacesFromResponse(regeneratedCourse));
      setPeriod(getGeneratedCoursePeriod(regeneratedCourse));
      setIsRegenerationComplete(true);
    } catch (error) {
      if (sequence !== regenerationSequence.current) return;
      setIsRegenerating(false);
      setRegenerationError(
        error instanceof Error ? error.message : '코스를 다시 생성하지 못했어요.',
      );
    }
  };

  const finishRegeneration = useCallback(() => {
    setResultVersion((version) => version + 1);
    setIsRegenerating(false);
    setIsRegenerationComplete(false);
  }, []);
  const cancelRegeneration = useCallback(() => {
    regenerationSequence.current += 1;
    setIsRegenerating(false);
    setIsRegenerationComplete(false);
  }, []);

  const saveCourse = () => {
    setCourseSaveNotice({ title });
    setIsSaveVisible(false);
    back();
  };

  return (
    <Screen testID={`course-result-${courseId}-${resultVersion}`}>
      <Scroll contentContainerStyle={scrollContentStyle}>
        <Header title={isEditing ? '코스 직접 편집' : '코스 생성 결과'}>
          {!isEditing ? (
            <ShareButton
              accessibilityRole="button"
              accessibilityLabel="공유하기"
              onPress={() => setIsShareVisible(true)}
            >
              <IconComponent name="share" color={colors.gray[900]} />
            </ShareButton>
          ) : null}
        </Header>
        <CourseResultMap />
        <CourseResultRoutine
          editing={isEditing}
          title={title}
          period={period}
          places={places}
          onPlacesChange={setPlaces}
          onTitleChange={setTitle}
          onSchedulePress={() => setIsScheduleVisible(true)}
        />
      </Scroll>
      {isEditing ? (
        <CourseResultEditActions
          onDirectAdd={() => setIsDirectPlaceVisible(true)}
          onPlaceSearch={() => setIsPlaceSearchVisible(true)}
          onSave={() => setIsEditing(false)}
        />
      ) : (
        <TripDetailActions
          onChatEdit={() => setIsChatVisible(true)}
          onDirectEdit={() => setIsEditing(true)}
          onRegenerate={() => setIsRegenerateVisible(true)}
          onSave={() => setIsSaveVisible(true)}
        />
      )}
      <CourseResultChatModal visible={isChatVisible} onClose={closeModals} />
      <CourseResultPlaceSearchModal
        visible={isPlaceSearchVisible}
        onAdd={addPlaces}
        onClose={closeModals}
      />
      <CourseResultDirectPlaceModal
        visible={isDirectPlaceVisible}
        onAdd={(place) => addPlaces([place])}
        onClose={closeModals}
      />
      <CourseResultScheduleModal
        visible={isScheduleVisible}
        value={period}
        onChange={setPeriod}
        onClose={closeModals}
      />
      <CourseResultShareModal visible={isShareVisible} title={title} onClose={closeModals} />
      {regenerationError ? <RegenerationError>{regenerationError}</RegenerationError> : null}
      <CourseResultRegenerateModal
        visible={isRegenerateVisible}
        onCancel={closeModals}
        onConfirm={regenerateCourse}
      />
      <CourseResultSaveModal
        visible={isSaveVisible}
        onClose={() => setIsSaveVisible(false)}
        onSave={saveCourse}
      />
      <CourseLoadingOverlay
        visible={isRegenerating}
        mode="regenerate"
        completed={isRegenerationComplete}
        onCancel={cancelRegeneration}
        onComplete={finishRegeneration}
      />
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const Scroll = styled.ScrollView({
  flex: 1,
  width: '100%',
});

const scrollContentStyle = {
  paddingBottom: 160,
} as const;

const ShareButton = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
  gap: 4,
});

const RegenerationError = styled.Text({
  position: 'absolute',
  right: 20,
  bottom: 154,
  left: 20,
  zIndex: 90,
  padding: 12,
  borderRadius: 8,
  backgroundColor: colors.semantic.warningDisabled,
  color: colors.semantic.warning,
  textAlign: 'center',
});
