import styled from '@emotion/native';
import { HomeHeader } from './HomeHeader';
import { HomeRecommendation } from './HomeRecommendation';
import { HomeTripInfo } from './HomeTripInfo';
import { IconButton } from '@components/Buttons/Button';

export function HomeScreen() {
  return (
    <Screen>
      <HomeHeader />
      <HomeRecommendation />
      <HomeTripInfo />
      <ButtonContainer>
        <IconButton icon="ai">AI로 여행 코스 만들기</IconButton>
      </ButtonContainer>
    </Screen>
  );
}

const Screen = styled.View({
  position: 'relative',
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const ButtonContainer = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
});
