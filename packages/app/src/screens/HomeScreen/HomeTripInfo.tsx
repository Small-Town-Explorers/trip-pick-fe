import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { IconComponent } from '@components/Icons';
import { Platform } from 'react-native';

const Mock = Array.from({ length: 3 }, (_, i) => ({
  date: new Date(`2026-09-0${i + 5}`),
  routine: ['백련사', '다산초당', '강진만 한정식', '가우도 출렁다리', '강진펜션'],
}));

const dateToStr = (_date: Date) => {
  const month = _date.getMonth() + 1;
  const date = _date.getDate();
  const day = ['일', '월', '화', '수', '목', '금', '토'][_date.getDay()];
  return `${month}.${date} ${day}`;
};

export const HomeTripInfo = () => {
  return (
    <TripSection>
      <TripHeader>
        <TripHeaderTitle>다가오는 내 여행{/* 진행중인 내 여행 */}</TripHeaderTitle>
        <NavigationIcon>
          <IconComponent name="carousel_right" color={colors.gray[400]} />
        </NavigationIcon>
      </TripHeader>
      <TripOverview>
        <TripTitle>강진 감성 힐링 투어</TripTitle>
        <MapPlaceholder>{/* 카카오 맵 */}</MapPlaceholder>
      </TripOverview>

      <ItineraryCarousel
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={itineraryCarouselContentStyle}
      >
        {Mock.map((day, i) => (
          <ItineraryDay key={i}>
            <ItineraryDayHeader>
              <DayLabel>Day {i + 1}</DayLabel>
              <DayDate>{dateToStr(day.date)}</DayDate>
            </ItineraryDayHeader>
            <ListView>
              {day.routine.map((routine, j) => (
                <ListItem key={`${i}_${j}`}>
                  <ListItemMarker>
                    <MarkerBadge>
                      <MarkerNumber>{i * 5 + j + 1}</MarkerNumber>
                    </MarkerBadge>
                    {j !== day.routine.length - 1 && <MarkerLine />}
                  </ListItemMarker>
                  <ListItemText>{routine}</ListItemText>
                </ListItem>
              ))}
            </ListView>
          </ItineraryDay>
        ))}
      </ItineraryCarousel>
    </TripSection>
  );
};

const TripSection = styled.View({
  width: '100%',
  paddingTop: 24,
  paddingBottom: 28,
  gap: 24,
});

const TripHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
});

const TripHeaderTitle = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const NavigationIcon = styled.Pressable({
  width: 24,
});

const TripOverview = styled.View({
  gap: 16,
  paddingHorizontal: 20,
});

const TripTitle = styled.Text({
  ...typography.heading4.semibold,
  color: colors.primary[1100],
});

const MapPlaceholder = styled.View({
  width: '100%',
  height: 200,
  backgroundColor: colors.gray[100],
  overflow: 'hidden',
  borderRadius: 16,
});

const ItineraryCarousel = styled.ScrollView({
  width: '100%',
});

const itineraryCarouselContentStyle = {
  gap: 16,
  paddingHorizontal: 20,
  paddingBottom: 12,
} as const;

const ItineraryDay = styled.View({
  gap: 20,
  width: 160,
});

const ItineraryDayHeader = styled.View({
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

const ListView = styled.View({});

const ListItem = styled.View({
  flexDirection: 'row',
  gap: 16,
});

const ListItemMarker = styled.View({
  alignItems: 'center',
});

const MarkerBadge = styled.View({
  width: 16,
  height: 16,
  backgroundColor: colors.primary[100],
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 9999,
});

const MarkerNumber = styled.Text({
  ...typography.caption3.medium,
  color: colors.primary[700],
});

const MarkerLine = styled.View({
  height: '100%',
  width: 1,
  backgroundColor: colors.primary[100],
});

const ListItemText = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[700],
  paddingBottom: 12,
});
