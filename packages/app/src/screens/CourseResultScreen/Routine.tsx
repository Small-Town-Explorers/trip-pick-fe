import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';
import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import { type CalendarRange } from '@components/Calendar';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import { TripSpotCard } from '@components/TripSpotCard';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useLayoutEffect, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';
import { mockTripInfoItems } from '../../ts/mock';
import { EditTripSpotCard } from '@components/EditTripSpotCard';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (dateString: string) => {
  const [year, month, date] = dateString.split('-').map(Number);
  const weekday = weekdays[new Date(year, month - 1, date).getDay()];
  return `${year}.${month}.${date} ${weekday}`;
};

const formatDistance = (meters: number) => `${(meters / 1000).toFixed(1)}\nkm`;

const dates = ['2026-09-05', '2026-09-06'];

export type CoursePlace = (typeof mockTripInfoItems)[number] & { uid: string; order: number };
export type CoursePlaces = CoursePlace[][];

export const createInitialCoursePlaces = (): CoursePlaces =>
  dates.map((date, dayIndex) =>
    mockTripInfoItems
      .filter((place) => place.date.toISOString().startsWith(date))
      .slice(0, dayIndex === 0 ? 5 : 2)
      .map((place, placeIndex) => ({
        ...place,
        uid: `${date}-${placeIndex}`,
        order: (dayIndex === 0 ? 0 : 5) + placeIndex + 1,
      })),
  );

const normalizeOrders = (days: CoursePlaces) => {
  let order = 0;
  return days.map((places) => places.map((place) => ({ ...place, order: ++order })));
};

interface CourseResultRoutineProps {
  editing?: boolean;
  title: string;
  period: CalendarRange;
  places: CoursePlaces;
  onTitleChange: (title: string) => void;
  onPlacesChange: (places: CoursePlaces) => void;
  onSchedulePress: () => void;
}

export function CourseResultRoutine({
  editing = false,
  title,
  period,
  places,
  onTitleChange,
  onPlacesChange,
  onSchedulePress,
}: CourseResultRoutineProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    dayIndex: number;
    uid: string;
    name: string;
  } | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>();
  const [dragPreview, setDragPreview] = useState<{
    dayIndex: number;
    uid: string;
    fromIndex: number;
    toIndex: number;
  } | null>(null);
  const [dragCommitting, setDragCommitting] = useState(false);
  const scheduleDates = [period.startDate, period.endDate].filter((date): date is string =>
    Boolean(date),
  );

  useLayoutEffect(() => {
    if (!dragCommitting || Platform.OS !== 'web') return;

    const frame = requestAnimationFrame(() => setDragCommitting(false));
    return () => cancelAnimationFrame(frame);
  }, [dragCommitting]);

  const reorderPlace = (dayIndex: number, fromIndex: number, offset: number) => {
    if (offset === 0) return;
    const nextDays = places.map((day) => [...day]);
    const targetIndex = Math.max(0, Math.min(nextDays[dayIndex].length - 1, fromIndex + offset));
    if (targetIndex === fromIndex) return;
    const [movedPlace] = nextDays[dayIndex].splice(fromIndex, 1);
    nextDays[dayIndex].splice(targetIndex, 0, movedPlace);
    onPlacesChange(normalizeOrders(nextDays));
  };

  const deletePlace = () => {
    if (!pendingDelete) return;
    const nextDays = places.map((day, dayIndex) =>
      dayIndex === pendingDelete.dayIndex
        ? day.filter((place) => place.uid !== pendingDelete.uid)
        : [...day],
    );
    onPlacesChange(normalizeOrders(nextDays));
    setPendingDelete(null);
  };

  return (
    <Section>
      <Heading>
        {isTitleEditing ? (
          <TitleInputContainer>
            <TitleInput
              autoFocus
              value={title}
              maxLength={30}
              onBlur={() => setIsTitleEditing(false)}
              onChangeText={onTitleChange}
              onSubmitEditing={() => setIsTitleEditing(false)}
              returnKeyType="done"
            />
            <ClearButton accessibilityRole="button" onPress={() => onTitleChange('')}>
              <IconComponent name="cancel" color="white" size={24} />
            </ClearButton>
          </TitleInputContainer>
        ) : (
          <>
            <Title>{title || '여행 코스 제목'}</Title>
            <EditButton
              accessibilityRole="button"
              accessibilityLabel="코스 제목 편집"
              onPress={() => setIsTitleEditing(true)}
            >
              <IconComponent name="pencil" color={colors.gray[400]} />
            </EditButton>
          </>
        )}
      </Heading>

      {scheduleDates.map((date, dayIndex) => (
        <DaySection key={date}>
          <DateRow>
            <DayLabel>Day {dayIndex + 1}</DayLabel>
            <DateText>{formatDate(date)}</DateText>
            {dayIndex === 0 ? (
              <ScheduleButton accessibilityRole="button" onPress={onSchedulePress}>
                <ScheduleLabel>날짜 변경</ScheduleLabel>
              </ScheduleButton>
            ) : null}
          </DateRow>

          <List>
            {places[dayIndex]?.map((place, placeIndex, dayPlaceList) => (
              <Item key={place.uid}>
                {editing ? (
                  <CardSlot>
                    <EditTripSpotCard
                      image={
                        (place.order % 2 === 0
                          ? Landscape2Image
                          : Landscape1Image) as unknown as ImageSourcePropType
                      }
                      name={place.placeName}
                      description={place.placeDesc}
                      maxDown={dayPlaceList.length - placeIndex - 1}
                      maxUp={placeIndex}
                      committing={dragCommitting}
                      shiftStep={
                        dragPreview?.dayIndex !== dayIndex || dragPreview.uid === place.uid
                          ? 0
                          : dragPreview.fromIndex < dragPreview.toIndex &&
                              placeIndex > dragPreview.fromIndex &&
                              placeIndex <= dragPreview.toIndex
                            ? -1
                            : dragPreview.fromIndex > dragPreview.toIndex &&
                                placeIndex >= dragPreview.toIndex &&
                                placeIndex < dragPreview.fromIndex
                              ? 1
                              : 0
                      }
                      onDelete={() => {
                        setPendingDelete({
                          dayIndex: dayIndex,
                          uid: place.uid,
                          name: place.placeName,
                        });
                        setPendingDeleteName(place.placeName);
                      }}
                      onDrag={(offset) =>
                        setDragPreview({
                          dayIndex,
                          uid: place.uid,
                          fromIndex: placeIndex,
                          toIndex: Math.max(
                            0,
                            Math.min(dayPlaceList.length - 1, placeIndex + offset),
                          ),
                        })
                      }
                      onDragCancel={() => setDragPreview(null)}
                      onDrop={(offset) => {
                        if (Platform.OS === 'web') {
                          setDragCommitting(true);
                        }
                        reorderPlace(dayIndex, placeIndex, offset);
                        setDragPreview(null);
                      }}
                    />
                  </CardSlot>
                ) : (
                  <>
                    <Route>
                      <Marker day={dayIndex}>
                        <MarkerNumber>{place.order}</MarkerNumber>
                      </Marker>
                      {placeIndex !== dayPlaceList.length - 1 ? (
                        <>
                          <UpperLine />
                          <Distance>{formatDistance(place.distKm)}</Distance>
                          <LowerLine />
                        </>
                      ) : null}
                    </Route>
                    <CardSlot>
                      <TripSpotCard
                        image={
                          (place.order % 2 === 0
                            ? Landscape2Image
                            : Landscape1Image) as unknown as ImageSourcePropType
                        }
                        type={place.placeType}
                        name={place.placeName}
                        description={place.placeDesc}
                        mapUrl={editing ? undefined : place.placeMap}
                      />
                    </CardSlot>
                  </>
                )}
              </Item>
            ))}
          </List>
        </DaySection>
      ))}
      <ConfirmModal
        confirmText="삭제"
        title="일정 삭제"
        visible={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={deletePlace}
      >
        <DeleteMessage>&quot;{pendingDeleteName}&quot; 일정을 삭제하시겠습니까?</DeleteMessage>
      </ConfirmModal>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 24,
});

const Heading = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const TitleInputContainer = styled.View({
  flex: 1,
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: colors.gray[25],
  borderRadius: 9999,
});

const TitleInput = styled.TextInput({
  flex: 1,
  minWidth: 0,
  paddingVertical: 0,
  ...typography.heading1.semibold,
  color: colors.gray[1000],

  ...Platform.select({
    web: { outlineStyle: 'none' as never, outlineWidth: 0 },
  }),
});

const ClearButton = styled.Pressable({
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
});

const ClearLabel = styled.Text({ fontSize: 24, lineHeight: 26, color: '#FFFFFF' });

const EditButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const DaySection = styled.View({
  width: '100%',
  gap: 0,
});

const DateRow = styled.View({
  height: 49,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
});

const DayLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
});

const DateText = styled.Text({
  flex: 1,
  ...typography.body2.regular,
  color: colors.gray[500],
});

const ScheduleButton = styled.Pressable({
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});

const ScheduleLabel = styled.Text({
  ...typography.caption2.medium,
  color: colors.primary[900],
});

const List = styled.View({
  width: '100%',
});

const Item = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
});

const Route = styled.View({
  width: 28,
  alignSelf: 'stretch',
  alignItems: 'center',
});

const Marker = styled.View<{ day: number }>(
  ({ day }) => ({
    backgroundColor: day % 2 === 0 ? colors.primary[1000] : colors.primary[700],
  }),
  {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
);

const MarkerNumber = styled.Text({
  ...typography.body2.semibold,
  color: '#FFFFFF',
});

const UpperLine = styled.View({
  width: 0,
  height: 20,
  borderLeftWidth: 1,
  borderColor: colors.gray[300],
  borderStyle: 'dotted',
});

const Distance = styled.Text({
  paddingVertical: 6,
  ...typography.caption1.medium,
  color: colors.gray[500],
  textAlign: 'center',
});

const LowerLine = styled.View({
  flex: 1,
  width: 0,
  borderLeftWidth: 1,
  borderColor: colors.gray[300],
  borderStyle: 'dotted',
});

const CardSlot = styled.View({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  paddingBottom: 16,
});

const DeleteMessage = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
