import styled from '@emotion/native';
import { colors } from '@styles';
import { TripDetailRoutine } from './Routine';
import { TripDetailActions } from './Bottom';
import { Header } from '@components/Header';
import { IconComponent } from '@components/Icons';

type Props = {
  tripId: string;
};

export function TripDetailScreen({ tripId }: Props) {
  return (
    <Screen testID={`trip-detail-${tripId}`}>
      <Scroll>
        <Header title="내 여행 상세">
          <ShareButton>
            <IconComponent name="share" color={colors.gray[900]} />
          </ShareButton>
        </Header>
        <Map />
        {/* 카카오 맵 추가 예정 */}
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

const ShareButton = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
  gap: 4,
});

const Map = styled.View({
  width: '100%',
  height: 240,
  backgroundColor: colors.gray[100],
});
