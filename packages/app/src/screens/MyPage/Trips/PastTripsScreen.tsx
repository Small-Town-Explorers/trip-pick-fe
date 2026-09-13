import { Header } from '@components/Header';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { ActivityIndicator } from 'react-native';
import { ApiError } from '../../../controllers';
import { appRoutes, useAppNavigation } from '../../../navigation';
import { usePastTripsQuery } from '../../../queries';
import { TripSummaryCard } from './TripSummaryCard';

export function MyPagePastTripsScreen() {
  const { navigate } = useAppNavigation();
  const { data: trips = [], error, isPending, refetch } = usePastTripsQuery();

  return (
    <Screen>
      <Header title="지난 여정" sub={`(${trips.length})`} />
      <Scroll contentContainerStyle={contentStyle}>
        <SectionTitle>지난 여행</SectionTitle>
        {isPending ? (
          <Status>
            <ActivityIndicator color={colors.primary[700]} />
            <StatusText>지난 여정을 불러오고 있어요.</StatusText>
          </Status>
        ) : null}
        {error ? (
          <Status>
            <StatusText>
              {error instanceof ApiError ? error.message : '지난 여정을 불러오지 못했어요.'}
            </StatusText>
            <RetryButton accessibilityRole="button" onPress={() => void refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </Status>
        ) : null}
        {!isPending && !error && trips.length === 0 ? (
          <Status>
            <StatusText>아직 지난 여정이 없어요.</StatusText>
          </Status>
        ) : null}
        {trips.length > 0 ? (
          <List>
            {trips.map((trip) => (
              <TripSummaryCard
                key={trip.id}
                trip={trip}
                onPress={() => navigate(appRoutes.tripDetail(trip.id))}
              />
            ))}
          </List>
        ) : null}
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const Scroll = styled.ScrollView({ flex: 1 });
const contentStyle = { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 } as const;
const SectionTitle = styled.Text({ ...typography.heading3.semibold, color: colors.gray[1000] });
const List = styled.View({ width: '100%', paddingTop: 24, gap: 24 });
const Status = styled.View({ alignItems: 'center', paddingVertical: 48, gap: 12 });
const StatusText = styled.Text({ ...typography.body2.regular, color: colors.gray[600] });
const RetryButton = styled.Pressable({ paddingHorizontal: 16, paddingVertical: 8 });
const RetryText = styled.Text({ ...typography.body2.semibold, color: colors.primary[700] });
