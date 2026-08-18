import styled from '@emotion/native';
import { colors } from '@styles';
import { TripDetailHeader } from './Header';
import { TripDetailRoutine } from './Routine';
import { TripDetailActions } from './Bottom';

type Props = {
  tripId: string;
};

export function TripDetailScreen({ tripId }: Props) {
  return (
    <Screen testID={`trip-detail-${tripId}`}>
      <Scroll>
        <TripDetailHeader />
        <Map />
        <TripDetailRoutine />
      </Scroll>
      <TripDetailActions />
    </Screen>
  );
}

const Screen = styled.View({
  position: 'relative',
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  paddingBottom: 120,
});

const Scroll = styled.ScrollView({
  flex: 1,
  width: '100%',
});

const Map = styled.View({
  width: '100%',
  height: 240,
  backgroundColor: colors.gray[100],
});
