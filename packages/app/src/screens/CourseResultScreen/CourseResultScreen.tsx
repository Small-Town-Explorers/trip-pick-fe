import { type CalendarRange } from '@components/Calendar';
import { CourseLoadingOverlay } from '@components/CourseLoadingOverlay';
import styled from '@emotion/native';
import { useCallback, useState } from 'react';
import { useAppNavigation } from '../../navigation';
import { setCourseSaveNotice } from '../../storage/courseSaveNotice';
import { TripDetailActions } from '../TripDetailScreen/Bottom';
import { CourseResultHeader } from './Header';
import { CourseResultEditActions } from './EditActions';
import { CourseResultChatModal } from './ChatModal';
import { CourseResultDirectPlaceModal } from './DirectPlaceModal';
import { CourseResultMap } from './Map';
import { CourseResultRegenerateModal } from './RegenerateModal';
import { CourseResultRoutine, createInitialCoursePlaces, type CoursePlaces } from './Routine';
import { CourseResultScheduleModal } from './ScheduleModal';
import { CourseResultShareModal } from './ShareModal';
import { CourseResultPlaceSearchModal } from './PlaceSearchModal';
import { CourseResultSaveModal } from './SaveModal';
import { type CoursePlaceInput } from './types';

interface CourseResultScreenProps {
  courseId: string;
}

export function CourseResultScreen({ courseId }: CourseResultScreenProps) {
  const { back } = useAppNavigation();
  const [title, setTitle] = useState('강진 감성 힐링 투어');
  const [period, setPeriod] = useState<CalendarRange>({
    startDate: '2026-09-05',
    endDate: '2026-09-06',
  });
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isRegenerateVisible, setIsRegenerateVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isPlaceSearchVisible, setIsPlaceSearchVisible] = useState(false);
  const [isDirectPlaceVisible, setIsDirectPlaceVisible] = useState(false);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);
  const [places, setPlaces] = useState<CoursePlaces>(createInitialCoursePlaces);

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
      const additions = newPlaces.map((place, index) => ({
        placeId: `added-${addedAt}-${index}`,
        placeName: place.name,
        placeType: place.type,
        placeDesc: place.description,
        placeMap: place.mapUrl ?? '',
        date: new Date(period.startDate ?? '2026-09-05'),
        distKm: 0,
        uid: `added-${addedAt}-${index}`,
        order: orderStart + index + 1,
      }));
      return [[...(days[0] ?? []), ...additions], ...days.slice(1)];
    });
  };

  const regenerateCourse = () => {
    closeModals();
    setIsRegenerating(true);
  };

  const finishRegeneration = useCallback(() => {
    setResultVersion((version) => version + 1);
    setIsRegenerating(false);
  }, []);
  const cancelRegeneration = useCallback(() => setIsRegenerating(false), []);

  const saveCourse = () => {
    setCourseSaveNotice({ title });
    setIsSaveVisible(false);
    back();
  };

  return (
    <Screen testID={`course-result-${courseId}-${resultVersion}`}>
      <Scroll contentContainerStyle={scrollContentStyle}>
        <CourseResultHeader
          editing={isEditing}
          onBack={isEditing ? () => setIsEditing(false) : undefined}
          onShare={() => setIsShareVisible(true)}
        />
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
