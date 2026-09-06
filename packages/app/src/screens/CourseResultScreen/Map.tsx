import styled from '@emotion/native';
import { KakaoMap } from '@components/KakaoMap';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { colors, typography } from '@styles';
import type { CoursePlaces } from './Routine';

const markers = [
  { number: 1, top: 20, left: 169 },
  { number: 2, top: 54, left: 102 },
  { number: 3, top: 124, left: 68 },
  { number: 4, top: 171, left: 142 },
  { number: 5, top: 95, left: 225 },
  { number: 6, top: 153, left: 292 },
  { number: 7, top: 42, left: 316 },
];

export function CourseResultMap({ places }: { places: CoursePlaces }) {
  const coordinates = useMemo(
    () => places.map((day) => day.map(({ lat, lng }) => ({ lat, lng }))),
    [places],
  );

  if (Platform.OS === 'web') {
    return <KakaoMap coordinates={coordinates} height={240} />;
  }

  return (
    <Map accessibilityLabel="여행 코스 지도 API 연동 예정">
      <MapLabel>지도 API 연동 예정</MapLabel>
      {markers.map((marker) => (
        <Marker key={marker.number} top={marker.top} left={marker.left}>
          <MarkerNumber>{marker.number}</MarkerNumber>
        </Marker>
      ))}
    </Map>
  );
}

const Map = styled.View({
  position: 'relative',
  width: '100%',
  height: 240,
  overflow: 'hidden',
  backgroundColor: colors.gray[100],
});

const MapLabel = styled.Text({
  position: 'absolute',
  right: 16,
  bottom: 12,
  ...typography.caption1.medium,
  color: colors.gray[500],
});

const Marker = styled.View<{ top: number; left: number }>(({ top, left }) => ({
  position: 'absolute',
  top,
  left,
  width: 28,
  height: 35,
  alignItems: 'center',
  paddingTop: 4,
  backgroundColor: colors.primary[1000],
  borderTopLeftRadius: 9999,
  borderTopRightRadius: 9999,
  borderBottomLeftRadius: 9999,
  transform: [{ rotate: '45deg' }],
}));

const MarkerNumber = styled.Text({
  ...typography.body2.semibold,
  color: '#FFFFFF',
  transform: [{ rotate: '-45deg' }],
});
