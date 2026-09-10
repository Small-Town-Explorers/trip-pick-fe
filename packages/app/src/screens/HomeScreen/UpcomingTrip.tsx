import { IconComponent } from '@components/Icons';
import { KakaoButton } from '@components/Buttons';
import { KakaoRouteMap } from '@components/KakaoMap';
import { useMemo } from 'react';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { ActivityIndicator, Platform } from 'react-native';
import { ApiError, hasApiAccessToken } from '../../controllers';
import { appRoutes, useAppNavigation } from '../../navigation';
import { useHomeTripQuery } from '../../queries';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (dateString: string) => {
  const [year, month, date] = dateString.split('-').map(Number);
  const weekday = weekdays[new Date(year, month - 1, date).getDay()];
  return `${month}.${date} ${weekday}`;
};

export const HomeUpcomingTrip = () => {
  const { navigate } = useAppNavigation();
  const isAuthenticated = hasApiAccessToken();
  const { data: trip, error, isPending, refetch } = useHomeTripQuery(isAuthenticated);
  const hasTrip = trip?.tripStatus !== 'NONE' && Boolean(trip?.id && trip.title);
  const sectionTitle = trip?.tripStatus === 'ONGOING' ? '진행 중인 내 여행' : '다가오는 내 여행';
  const markerCount =
    trip?.plan.reduce(
      (count, day) =>
        count + day.items.filter((item) => item.lat !== null && item.lng !== null).length,
      0,
    ) ?? 0;

  const openTrip = () => {
    if (trip?.id) navigate(appRoutes.tripDetail(trip.id));
  };

  const days = useMemo(() => [...(trip?.plan ?? [])].sort((a, b) => a.day - b.day), [trip?.plan]);
  const coordinates = useMemo(
    () => days.map(({ items }) => items.map(({ lat, lng }) => ({ lat, lng }))),
    [days],
  );

  return (
    <Section>
      <Header>
        <Title>{sectionTitle}</Title>
        {hasTrip ? (
          <MoreButton
            accessibilityRole="button"
            accessibilityLabel={`${trip?.title ?? '여행'} 상세 보기`}
            onPress={openTrip}
          >
            <IconComponent name="carousel_right" color={colors.gray[400]} />
          </MoreButton>
        ) : null}
      </Header>

      {!isAuthenticated ? (
        <LoginPrompt>
          <IconComponent name="profile" color={colors.primary[500]} size={28} />
          <LoginPromptTitle>로그인하고 여행 코스를 만들어 보세요.</LoginPromptTitle>
          <LoginPromptDescription>
            AI가 취향에 맞게 추천한 코스와 스마트 동선 지도를{`\n`}언제든 꺼내볼 수 있습니다.
          </LoginPromptDescription>
          <LoginAction>
            <KakaoButton onPress={() => navigate(appRoutes.login)} />
          </LoginAction>
        </LoginPrompt>
      ) : null}

      {isAuthenticated && isPending ? (
        <State>
          <ActivityIndicator color={colors.primary[700]} />
          <StateText>여행 일정을 불러오고 있어요.</StateText>
        </State>
      ) : null}

      {isAuthenticated && error ? (
        <State>
          <StateText>
            {error instanceof ApiError ? error.message : '여행 일정을 불러오지 못했어요.'}
          </StateText>
          <RetryButton accessibilityRole="button" onPress={() => void refetch()}>
            <RetryText>다시 시도</RetryText>
          </RetryButton>
        </State>
      ) : null}

      {isAuthenticated && !isPending && !error && !hasTrip ? (
        <NoTrip>
          <IconComponent name="luggage" color={colors.primary[500]} size={28} />
          <NoTripText>예정되거나 진행 중인 여행이 없어요.</NoTripText>
          <NoTripSubText>
            {'나에게 꼭맞는 소도시 코스를 추천 받고,\n새로운 여행을 즐겨보세요!'}
          </NoTripSubText>
        </NoTrip>
      ) : null}

      {isAuthenticated && !isPending && !error && hasTrip ? (
        <>
          <Overview>
            <TripTitle>{trip?.title}</TripTitle>
            <Map accessibilityLabel={`좌표가 등록된 여행 장소 ${markerCount}곳의 지도`}>
              <KakaoRouteMap coordinates={coordinates} height={200} />
            </Map>
          </Overview>

          <Carousel
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            contentContainerStyle={carouselStyle}
          >
            {days.map((day, dayIndex) => (
              <Day key={`${day.day}-${day.date}`}>
                <DayHeader>
                  <DayLabel>Day {day.day}</DayLabel>
                  <DayDate>{formatDate(day.date)}</DayDate>
                </DayHeader>
                <List>
                  {day.items.length > 0 ? (
                    day.items.map((place, placeIndex) => (
                      <Item key={`${day.day}-${placeIndex}-${place.title}`}>
                        <Route>
                          <Marker>
                            <MarkerNumber>
                              {days
                                .slice(0, dayIndex)
                                .reduce((total, previous) => total + previous.items.length, 0) +
                                placeIndex +
                                1}
                            </MarkerNumber>
                          </Marker>
                          {placeIndex !== day.items.length - 1 ? <Line /> : null}
                        </Route>
                        <Place numberOfLines={2}>{place.title}</Place>
                      </Item>
                    ))
                  ) : (
                    <EmptyDayText>등록된 장소가 없어요.</EmptyDayText>
                  )}
                </List>
              </Day>
            ))}
          </Carousel>
        </>
      ) : null}
    </Section>
  );
};

const NoTrip = styled.View({
  alignItems: 'center',
  gap: 12,
  paddingVertical: 32,
  backgroundColor: colors.gray[25],
  marginHorizontal: 20,
  borderRadius: 16,
});

const NoTripText = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
});

const NoTripSubText = styled.Text({
  textAlign: 'center',
  ...typography.body3.regular,
  color: colors.gray[500],
});

const LoginPrompt = styled.View({
  alignItems: 'center',
  marginHorizontal: 20,
  paddingVertical: 32,
  paddingHorizontal: 20,
  gap: 12,
  borderRadius: 16,
  backgroundColor: colors.gray[25],
});

const LoginPromptTitle = styled.Text({
  ...typography.body1.medium,
  color: colors.gray[800],
  textAlign: 'center',
});

const LoginPromptDescription = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
  textAlign: 'center',
});

const LoginAction = styled.View({
  alignSelf: 'stretch',
  paddingTop: 16,
});

const Section = styled.View({
  width: '100%',
  paddingTop: 24,
  paddingBottom: 40,
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
  alignItems: 'center',
  justifyContent: 'center',
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
  minHeight: 28,
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

const MarkerNumber = styled.Text({
  ...typography.caption3.medium,
  color: colors.primary[700],
});

const Line = styled.View({
  flex: 1,
  width: 1,
  minHeight: 12,
  backgroundColor: colors.primary[100],
});

const Place = styled.Text({
  flex: 1,
  ...typography.body3.medium,
  color: colors.gray[700],
  paddingBottom: 12,
});

const EmptyDayText = styled.Text({
  ...typography.caption1.regular,
  color: colors.gray[500],
});

const State = styled.View({
  minHeight: 160,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  gap: 12,
});

const StateText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const RetryButton = styled.Pressable({
  paddingHorizontal: 16,
  paddingVertical: 9,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});

const RetryText = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[700],
});
