import styled from '@emotion/native';
import { HomeHeader } from './Header';
import { HomeRecommendations } from './Recommendations';
import { HomeUpcomingTrip } from './UpcomingTrip';
import { IconButton } from '@components/Buttons/Button';

export function HomeScreen() {
  return (
    <Screen>
      <HomeHeader />
      <HomeRecommendations />
      <HomeUpcomingTrip />
      <Action>
        <IconButton icon="ai">AI로 여행 코스 만들기</IconButton>
      </Action>
    </Screen>
  );
}

const Screen = styled.View({
  position: 'relative',
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const Action = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
});
