import { Header } from '@components/Header';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { mockPastTrips } from './mockTrips';
import { TripSummaryCard } from './TripSummaryCard';

export function MyPagePastTripsScreen() {
  return (
    <Screen>
      <Header title="지난 여정" sub={`(${mockPastTrips.length})`} />
      <Scroll contentContainerStyle={contentStyle}>
        <SectionTitle>지난 여행</SectionTitle>
        <List>
          {mockPastTrips.map((trip) => (
            <TripSummaryCard key={trip.id} trip={trip} />
          ))}
        </List>
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const Scroll = styled.ScrollView({ flex: 1 });
const contentStyle = { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 } as const;
const SectionTitle = styled.Text({ ...typography.heading3.semibold, color: colors.gray[1000] });
const List = styled.View({ width: '100%', paddingTop: 24, gap: 24 });
