import { type CalendarRange } from '@components/Calendar';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import { TripSpotCard } from '@components/TripSpotCard';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';
import { EditTripSpotCard } from '@components/EditTripSpotCard';
import type { CoursePlaceInput } from './types';
import type { GeneratedCourseResponse } from '../../controllers';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (dateString: string) => {
  const [year, month, date] = dateString.split('-').map(Number);
  const weekday = weekdays[new Date(year, month - 1, date).getDay()];
  return `${year}.${month}.${date} ${weekday}`;
};

const formatDistance = (meters: number) => `${(meters / 1000).toFixed(1)}\nkm`;

export type CoursePlace = CoursePlaceInput & {
  uid: string;
  order: number;
  date: Date;
  distanceMeters: number | null;
};
export type CoursePlaces = CoursePlace[][];

export const createCoursePlacesFromResponse = (course: GeneratedCourseResponse): CoursePlaces => {
  let globalOrder = 0;
  const startDate = course.startDate ?? new Date().toISOString().slice(0, 10);

  const places = course.plan.map(({ day, items }) => {
    const date = addDays(startDate, day - 1);

    return items.map((item): CoursePlace => {
      const isKakao = item.contentId?.startsWith('kakao:') ?? false;
      const externalId = item.contentId
        ? isKakao
          ? item.contentId.slice('kakao:'.length)
          : item.contentId
        : null;
      const id = item.contentId
        ? `${isKakao ? 'KAKAO' : 'TOUR'}:${externalId}`
        : `FREE_TIME:${day}:${item.order}`;

      return {
        id,
        externalId,
        name: item.title,
        tag: item.slot,
        summary: item.reason ?? item.address ?? item.title,
        image: item.imageUrl,
        lat: item.lat,
        lng: item.lng,
        date,
        distanceMeters: null,
        uid: `${day}:${item.order}:${id}`,
        order: ++globalOrder,
      };
    });
  });

  return recalculateCoursePlaces(places);
};

const addDays = (dateString: string, days: number) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date;
};

const getScheduleDates = ({ startDate, endDate }: CalendarRange) => {
  if (!startDate) return [];
  if (!endDate) return [startDate];

  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00`);
  const last = new Date(`${endDate}T00:00:00`);

  while (current <= last) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const date = String(current.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${date}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const getPlaceMapUrl = (place: CoursePlace) => {
  if (place.id.startsWith('KAKAO:') && place.externalId) {
    return `https://map.kakao.com/link/map/${encodeURIComponent(place.externalId)}`;
  }

  if (place.id.startsWith('TOUR:')) {
    return `https://map.kakao.com/link/search/${encodeURIComponent(place.name)}`;
  }

  return undefined;
};

export const recalculateCoursePlaces = (days: CoursePlaces): CoursePlaces => {
  let order = 0;
  return days.map((places) =>
    places.map((place, index) => ({
      ...place,
      order: ++order,
      distanceMeters: index === 0 ? null : calculateDistanceMeters(places[index - 1], place),
    })),
  );
};

const calculateDistanceMeters = (from: CoursePlace, to: CoursePlace) => {
  if (from.lat === null || from.lng === null || to.lat === null || to.lng === null) return null;

  const earthRadiusMeters = 6_371_000;
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lng - from.lng);
  const fromLatitude = toRadians(from.lat);
  const toLatitude = toRadians(to.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

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
  const scheduleDates = getScheduleDates(period);

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
    onPlacesChange(recalculateCoursePlaces(nextDays));
  };

  const deletePlace = () => {
    if (!pendingDelete) return;
    const nextDays = places.map((day, dayIndex) =>
      dayIndex === pendingDelete.dayIndex
        ? day.filter((place) => place.uid !== pendingDelete.uid)
        : [...day],
    );
    onPlacesChange(recalculateCoursePlaces(nextDays));
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
                      image={place.image}
                      name={place.name}
                      description={place.summary}
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
                          name: place.name,
                        });
                        setPendingDeleteName(place.name);
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
                          {dayPlaceList[placeIndex + 1].distanceMeters !== null ? (
                            <Distance>
                              {formatDistance(dayPlaceList[placeIndex + 1].distanceMeters!)}
                            </Distance>
                          ) : null}
                          <LowerLine />
                        </>
                      ) : null}
                    </Route>
                    <CardSlot>
                      <TripSpotCard
                        image={place.image}
                        type={place.tag}
                        name={place.name}
                        description={place.summary}
                        mapUrl={editing ? undefined : getPlaceMapUrl(place)}
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
