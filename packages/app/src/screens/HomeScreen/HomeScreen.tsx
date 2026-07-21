import styled from '@emotion/native';
import { useAppNavigation } from '../../navigation';

export function HomeScreen() {
  const { navigate } = useAppNavigation();

  return (
    <Container>
      <Title>소도시 발굴단</Title>
      <Description>Web &amp; App Shared Screen</Description>
      <StartButton accessibilityRole="button" onPress={() => navigate('/test-one')}>
        <ButtonText>시작하기</ButtonText>
      </StartButton>
    </Container>
  );
}

const Container = styled.View({
  flex: 1,
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  padding: 24,
  backgroundColor: '#f7f4ed',
});

const Title = styled.Text({
  color: '#1f2937',
  fontSize: 32,
  fontWeight: '700',
});

const Description = styled.Text({
  color: '#4b5563',
  fontSize: 17,
});

const StartButton = styled.Pressable({
  marginTop: 8,
  paddingHorizontal: 24,
  paddingVertical: 13,
  borderRadius: 10,
  backgroundColor: '#2563eb',
});

const ButtonText = styled.Text({
  color: '#ffffff',
  fontSize: 16,
  fontWeight: '600',
});
