import { type CalendarRange } from '@components/Calendar';
import { IconComponent } from '@components/Icons';
import { TripSpotCard } from '@components/TripSpotCard';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { CoursePlaceInput } from './types';
import type { GeneratedCourseResponse } from '../../controllers';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDate = (dateString: string) => {
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

export const getScheduleDates = ({ startDate, endDate }: CalendarRange) => {
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
      distanceMeters: calculateDistanceMeters(places, index),
    })),
  );
};

const calculateDistanceMeters = (places: CoursePlace[], currentIndex: number) => {
  const to = places[currentIndex];
  if (!to || to.lat === null || to.lng === null) return null;

  let fromLat: number | undefined;
  let fromLng: number | undefined;
  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    const candidate = places[index];
    if (candidate.lat !== null && candidate.lng !== null) {
      fromLat = candidate.lat;
      fromLng = candidate.lng;
      break;
    }
  }

  if (fromLat === undefined || fromLng === undefined) return null;

  const earthRadiusMeters = 6_371_000;
  const latitudeDelta = toRadians(to.lat - fromLat);
  const longitudeDelta = toRadians(to.lng - fromLng);
  const fromLatitude = toRadians(fromLat);
  const toLatitude = toRadians(to.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

interface CourseResultRoutineProps {
  title: string;
  period: CalendarRange;
  places: CoursePlaces;
  onTitleChange: (title: string) => void;
  onSchedulePress: () => void;
}

export function CourseResultRoutine({
  title,
  period,
  places,
  onTitleChange,
  onSchedulePress,
}: CourseResultRoutineProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const scheduleDates = useMemo(() => getScheduleDates(period), [period]);

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
                <ScheduleLabel>일정 변경</ScheduleLabel>
              </ScheduleButton>
            ) : null}
          </DateRow>

          <List>
            {places[dayIndex].length === 0 ? (
              <EmptyList>
                <EmptyListText>등록된 여행지가 없습니다.</EmptyListText>
                <EmptyListSubText>
                  {'1일차 일정이 모두 비어있어요.\n새로운 여행지를 코스에 추가해 보세요!'}
                </EmptyListSubText>
              </EmptyList>
            ) : null}
            {places[dayIndex]?.map((place, placeIndex, dayPlaceList) => (
              <Item key={place.uid}>
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
                      mapUrl={getPlaceMapUrl(place)}
                    />
                  </CardSlot>
                </>
              </Item>
            ))}
          </List>
        </DaySection>
      ))}
    </Section>
  );
}

const EmptyList = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 32,
  gap: 12,
});

const EmptyListText = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
});

const EmptyListSubText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
  textAlign: 'center',
});

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
