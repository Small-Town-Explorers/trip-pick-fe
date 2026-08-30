import { IconComponent } from '@components/Icons';
import { TripSpotCard } from '@components/TripSpotCard';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useMemo, useState } from 'react';
import { mockTripInfoItems } from '../../ts/mock';
import { type ImageSourcePropType } from 'react-native';
import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';

type Place = (typeof mockTripInfoItems)[number] & { order: number };
type TripDay = { date: string; places: Place[] };

const formatDate = (value: Date) => {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const date = value.getDate();
  const day = ['일', '월', '화', '수', '목', '금', '토'][value.getDay()];
  return `${year}.${month}.${date} ${day}`;
};

const formatDistance = (meters: number) => {
  return `${(meters / 1000).toFixed(1)}\nkm`;
};

export const TripDetailRoutine = () => {
  const [dayIndex] = useState(0);

  const days = useMemo(() => {
    return Object.values(
      mockTripInfoItems.reduce<Record<string, TripDay>>((groupedDays, place, placeIndex) => {
        const date = formatDate(place.date);
        groupedDays[date] ??= {
          date,
          places: [],
        };
        groupedDays[date].places.push({
          ...place,
          order: placeIndex + 1,
        });

        return groupedDays;
      }, {}),
    );
  }, []);

  return (
    <Section>
      <Heading>
        <Title>강진 감성 힐링 투어</Title>
        <EditIcon>
          <IconComponent name="pencil" color={colors.gray[400]} />
        </EditIcon>
      </Heading>
      <DateRow>
        <Day>Day {dayIndex + 1}</Day>
        <Date>{days[dayIndex].date}</Date>
        <DateButton>
          <DateButtonText>날짜 변경</DateButtonText>
        </DateButton>
      </DateRow>
      <List>
        {days[dayIndex].places.map((place, placeIndex, places) => (
          <Item key={`${place.placeId}-${placeIndex}`}>
            <Route>
              <Marker>
                <Number>{place.order}</Number>
              </Marker>
              <UpperLine />
              <Distance>{formatDistance(0)}</Distance>
              {placeIndex !== places.length - 1 && <LowerLine />}
            </Route>
            <CardSlot>
              <TripSpotCard
                image={
                  place.placeImage
                    ? { uri: place.placeImage }
                    : (Landscape1Image as unknown as ImageSourcePropType)
                }
                type={place.placeTag}
                name={place.placeName}
                description={place.placeSummary}
                mapUrl={
                  place.placeSource === 'KAKAO'
                    ? `https://place.map.kakao.com/${place.placeId}`
                    : `https://map.kakao.com/link/map/${encodeURIComponent(place.placeName)},${place.placeLocation.lat},${place.placeLocation.lng}`
                }
              />
            </CardSlot>
          </Item>
        ))}
      </List>
    </Section>
  );
};

const Section = styled.View({
  width: '100%',
  gap: 24,
  paddingHorizontal: 20,
  paddingVertical: 24,
});

const Heading = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const EditIcon = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
});

const DateRow = styled.View({
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
});

const Day = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
  flexShrink: 0,
});

const Date = styled.Text({
  flex: 1,
  ...typography.body2.regular,
  color: colors.gray[500],
});

const DateButton = styled.Pressable({
  flexShrink: 0,
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});

const DateButtonText = styled.Text({
  ...typography.caption2.medium,
  color: colors.primary[900],
});

const List = styled.View({});

const Item = styled.View({
  width: '100%',
  gap: 16,
  flexDirection: 'row',
});

const Route = styled.View({
  alignItems: 'center',
});

const Marker = styled.View({
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary[1000],
  borderRadius: 9999,
});

const Number = styled.Text({
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
});

const LowerLine = styled.View({
  flexGrow: 1,
  width: 0,
  borderLeftWidth: 1,
  borderColor: colors.gray[300],
  borderStyle: 'dotted',
});

const CardSlot = styled.View({
  flex: 1,
  minWidth: 0,
  marginBottom: 16,
});
