import { Header } from '@components/Header';
import { KakaoRegionMap } from '@components/KakaoMap';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ApiError } from '../../../controllers';
import { appRoutes, useAppNavigation } from '../../../navigation';
import { usePastTripsQuery, useVisitedRegionsQuery } from '../../../queries';
import { TripSummaryCard } from './TripSummaryCard';
import { ContentScroll } from '@components/ContentScroll';

const getRegionKey = (areaCode: string | null, sigunguCode: string | null) =>
  `${areaCode ?? ''}:${sigunguCode ?? ''}`;

export function MyPageVisitedRegionsScreen() {
  const { navigate } = useAppNavigation();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const regionsQuery = useVisitedRegionsQuery();
  const tripsQuery = usePastTripsQuery();
  const regions = regionsQuery.data ?? [];
  const trips = tripsQuery.data ?? [];
  const regionMarkers = regions.flatMap(({ areaCode, sigunguCode, regionName, lat, lng }) =>
    regionName && lat !== null && lng !== null
      ? [{ id: getRegionKey(areaCode, sigunguCode), label: regionName, lat, lng }]
      : [],
  );
  const filteredTrips = selectedRegionId
    ? trips.filter(
        ({ areaCode, sigunguCode }) => getRegionKey(areaCode, sigunguCode) === selectedRegionId,
      )
    : trips;
  const selectedRegion = regions.find(
    ({ areaCode, sigunguCode }) => getRegionKey(areaCode, sigunguCode) === selectedRegionId,
  );
  const isPending = regionsQuery.isPending || tripsQuery.isPending;
  const error = regionsQuery.error ?? tripsQuery.error;
  const regionNames = regions.flatMap(({ regionName }) => (regionName ? [regionName] : []));

  return (
    <Screen>
      <Header title="방문한 지역" sub={`(${regions.length})`} />
      <ContentScroll contentContainerStyle={contentStyle} paddingBottom={20}>
        {isPending ? (
          <Status>
            <ActivityIndicator color={colors.primary[700]} />
            <StatusText>방문한 지역을 불러오고 있어요.</StatusText>
          </Status>
        ) : null}
        {error ? (
          <Status>
            <StatusText>
              {error instanceof ApiError ? error.message : '방문한 지역을 불러오지 못했어요.'}
            </StatusText>
            <RetryButton
              accessibilityRole="button"
              onPress={() => {
                void regionsQuery.refetch();
                void tripsQuery.refetch();
              }}
            >
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </Status>
        ) : null}
        {!isPending && !error && regions.length === 0 ? (
          <Status>
            <StatusText>아직 방문한 지역이 없어요.</StatusText>
          </Status>
        ) : null}
        {!isPending && !error && regions.length > 0 ? (
          <>
            <MapSection>
              <SectionHeading>
                <SectionTitle>방문한 지역 지도</SectionTitle>
                <SectionCount>{regions.length}개의 지역</SectionCount>
              </SectionHeading>
              {regionNames.length > 0 ? <RegionNames>{regionNames.join(', ')}</RegionNames> : null}
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
                {selectedRegion?.regionName ? (
                  <SectionCount>{selectedRegion.regionName}</SectionCount>
                ) : null}
              </SectionHeading>
              <TripList>
                {filteredTrips.map((trip) => (
                  <TripSummaryCard
                    key={trip.id}
                    trip={trip}
                    onPress={() => navigate(appRoutes.tripDetail(trip.id))}
                  />
                ))}
                {filteredTrips.length === 0 ? (
                  <StatusText>이 지역의 지난 여행이 없어요.</StatusText>
                ) : null}
              </TripList>
            </TripsSection>
          </>
        ) : null}
      </ContentScroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const contentStyle = { paddingHorizontal: 20, paddingTop: 24, gap: 36 } as const;
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
const Status = styled.View({ alignItems: 'center', paddingVertical: 48, gap: 12 });
const StatusText = styled.Text({ ...typography.body2.regular, color: colors.gray[600] });
const RetryButton = styled.Pressable({ paddingHorizontal: 16, paddingVertical: 8 });
const RetryText = styled.Text({ ...typography.body2.semibold, color: colors.primary[700] });
