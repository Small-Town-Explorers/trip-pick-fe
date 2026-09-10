import { Header } from '@components/Header';
import { KakaoRegionMap } from '@components/KakaoMap';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { mockPastTrips, mockVisitedRegions } from './mockTrips';
import { TripSummaryCard } from './TripSummaryCard';

const regionMarkers = mockVisitedRegions.map(({ id, name, lat, lng }) => ({
  id,
  label: name,
  lat,
  lng,
}));

export function MyPageVisitedRegionsScreen() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const filteredTrips = selectedRegionId
    ? mockPastTrips.filter(({ regionId }) => regionId === selectedRegionId)
    : mockPastTrips;
  const selectedRegion = mockVisitedRegions.find(({ id }) => id === selectedRegionId);

  return (
    <Screen>
      <Header title="방문한 지역" sub={`(${mockVisitedRegions.length})`} />
      <Scroll contentContainerStyle={contentStyle}>
        <MapSection>
          <SectionHeading>
            <SectionTitle>방문한 지역 지도</SectionTitle>
            <SectionCount>{mockVisitedRegions.length}개의 지역</SectionCount>
          </SectionHeading>
          <RegionNames>{mockVisitedRegions.map(({ name }) => name).join(', ')}</RegionNames>
          <MapFrame>
            <KakaoRegionMap
              height={320}
              markers={regionMarkers}
              selectedId={selectedRegionId}
              style={{ borderRadius: 12 }}
              onMarkerPress={(regionId) =>
                setSelectedRegionId((current) => (current === regionId ? null : regionId))
              }
            />
          </MapFrame>
        </MapSection>

        <TripsSection>
          <SectionHeading>
            <SectionTitle>방문한 여행</SectionTitle>
            {selectedRegion ? <SectionCount>{selectedRegion.name}</SectionCount> : null}
          </SectionHeading>
          <TripList>
            {filteredTrips.map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} />
            ))}
          </TripList>
        </TripsSection>
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const Scroll = styled.ScrollView({ flex: 1 });
const contentStyle = { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 36 } as const;
const MapSection = styled.View({ width: '100%', gap: 10 });
const TripsSection = styled.View({ width: '100%', gap: 20 });
const SectionHeading = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 8 });
const SectionTitle = styled.Text({ ...typography.heading3.semibold, color: colors.gray[1000] });
const SectionCount = styled.Text({ ...typography.body3.regular, color: colors.gray[500] });
const RegionNames = styled.Text({ ...typography.body3.regular, color: colors.gray[600] });
const MapFrame = styled.View({
  width: '100%',
  height: 320,
  marginTop: 4,
  overflow: 'hidden',
  borderRadius: 12,
  backgroundColor: colors.gray[50],
});
const TripList = styled.View({ width: '100%', gap: 24 });
