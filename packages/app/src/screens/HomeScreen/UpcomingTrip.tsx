import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { IconComponent } from '@components/Icons';
import { Platform } from 'react-native';
import { mockTripInfoItems } from '../../ts/mock';
import { useMemo } from 'react';
import { appRoutes, useAppNavigation } from '../../navigation';

type TripPlace = Pick<(typeof mockTripInfoItems)[number], 'placeId' | 'placeName'> & {
  order: number;
};
type TripDay = { date: string; places: TripPlace[] };

const formatDate = (value: Date) => {
  const month = value.getMonth() + 1;
  const date = value.getDate();
  const day = ['일', '월', '화', '수', '목', '금', '토'][value.getDay()];
  return `${month}.${date} ${day}`;
};

export const HomeUpcomingTrip = () => {
  const { navigate } = useAppNavigation();

  const days = useMemo(() => {
    return Object.values(
      mockTripInfoItems.reduce<Record<string, TripDay>>(
        (groupedDays, place, placeIndex) => {
          const date = formatDate(place.date);
          groupedDays[date] ??= {
            date,
            places: [],
          };
          groupedDays[date].places.push({
            order: placeIndex + 1,
            placeId: place.placeId,
            placeName: place.placeName,
          });

          return groupedDays;
        },
        {},
      ),
    );
  }, []);

  return (
    <Section>
      <Header>
        <Title>다가오는 내 여행{/* 진행중인 내 여행 */}</Title>
        <MoreButton onPress={() => navigate(appRoutes.tripDetail('test'))}>
          <IconComponent name="carousel_right" color={colors.gray[400]} />
        </MoreButton>
      </Header>
      <Overview>
        <TripTitle>강진 감성 힐링 투어</TripTitle>
        <Map>{/* 카카오 맵 */}</Map>
      </Overview>

      <Carousel
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={carouselStyle}
      >
        {days.map((day, dayIndex) => (
          <Day key={day.date}>
            <DayHeader>
              <DayLabel>Day {dayIndex + 1}</DayLabel>
              <DayDate>{day.date}</DayDate>
            </DayHeader>
            <List>
              {day.places.map((place, placeIndex) => (
                <Item key={`${place.placeId}-${place.order}`}>
                  <Route>
                    <Marker>
                      <Number>{place.order}</Number>
                    </Marker>
                    {placeIndex !== day.places.length - 1 && <Line />}
                  </Route>
                  <Place>{place.placeName}</Place>
                </Item>
              ))}
            </List>
          </Day>
        ))}
      </Carousel>
    </Section>
  );
};

const Section = styled.View({
  width: '100%',
  paddingTop: 24,
  paddingBottom: 28,
  gap: 24,
});

const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const MoreButton = styled.Pressable({
  width: 24,
});

const Overview = styled.View({
  gap: 16,
  paddingHorizontal: 20,
});

const TripTitle = styled.Text({
  ...typography.heading4.semibold,
  color: colors.primary[1100],
});

const Map = styled.View({
  width: '100%',
  height: 200,
  backgroundColor: colors.gray[100],
  overflow: 'hidden',
  borderRadius: 16,
});

const Carousel = styled.ScrollView({
  width: '100%',
});

const carouselStyle = {
  gap: 16,
  paddingHorizontal: 20,
  paddingBottom: 12,
} as const;

const Day = styled.View({
  gap: 20,
  width: 160,
});

const DayHeader = styled.View({
  flexDirection: 'row',
  gap: 12,
});

const DayLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
});

const DayDate = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[500],
});

const List = styled.View({});

const Item = styled.View({
  flexDirection: 'row',
  gap: 16,
});

const Route = styled.View({
  alignItems: 'center',
});

const Marker = styled.View({
  width: 16,
  height: 16,
  backgroundColor: colors.primary[100],
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 9999,
});

const Number = styled.Text({
  ...typography.caption3.medium,
  color: colors.primary[700],
});

const Line = styled.View({
  height: '100%',
  width: 1,
  backgroundColor: colors.primary[100],
});

const Place = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[700],
  paddingBottom: 12,
});
