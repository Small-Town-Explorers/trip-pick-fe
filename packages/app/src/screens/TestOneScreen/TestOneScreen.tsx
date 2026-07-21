import styled from '@emotion/native';
import { Pressable, Text, View } from 'react-native';
import { useAppNavigation } from '../../navigation';

export function TestOneScreen() {
  const { navigate } = useAppNavigation();

  return (
    <Container>
      <Badge>TEST PAGE 01</Badge>
      <Title>이번 주말, 어디로 떠날까요?</Title>
      <Description>TripPick이 취향에 맞는 작은 도시와 여행 아이디어를 골라드려요.</Description>

      <Card>
        <Emoji>🌿</Emoji>
        <CardContent>
          <CardLabel>오늘의 추천</CardLabel>
          <CardTitle>고요한 숲과 호수가 있는 도시</CardTitle>
        </CardContent>
      </Card>

      <ButtonRow>
        <SecondaryButton accessibilityRole="button" onPress={() => navigate('/')}>
          <SecondaryButtonText>홈으로</SecondaryButtonText>
        </SecondaryButton>
        <PrimaryButton accessibilityRole="button" onPress={() => navigate('/test-two')}>
          <PrimaryButtonText>다음 페이지</PrimaryButtonText>
        </PrimaryButton>
      </ButtonRow>
    </Container>
  );
}

const Container = styled(View)({
  flex: 1,
  minHeight: '100%',
  justifyContent: 'center',
  padding: 24,
  backgroundColor: '#ecfdf5',
});

const Badge = styled(Text)({
  alignSelf: 'flex-start',
  marginBottom: 16,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  color: '#047857',
  backgroundColor: '#d1fae5',
  fontSize: 12,
  fontWeight: '700',
});

const Title = styled(Text)({
  maxWidth: 480,
  color: '#064e3b',
  fontSize: 34,
  fontWeight: '800',
  lineHeight: 44,
});

const Description = styled(Text)({
  maxWidth: 520,
  marginTop: 12,
  color: '#475569',
  fontSize: 17,
  lineHeight: 26,
});

const Card = styled(View)({
  width: '100%',
  maxWidth: 560,
  marginTop: 32,
  padding: 20,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  borderRadius: 18,
  backgroundColor: '#ffffff',
});

const Emoji = styled(Text)({ fontSize: 42 });
const CardContent = styled(View)({ flex: 1, gap: 4 });
const CardLabel = styled(Text)({ color: '#059669', fontSize: 13, fontWeight: '700' });
const CardTitle = styled(Text)({ color: '#1e293b', fontSize: 18, fontWeight: '700' });
const ButtonRow = styled(View)({ flexDirection: 'row', gap: 12, marginTop: 32 });

const SecondaryButton = styled(Pressable)({
  paddingHorizontal: 20,
  paddingVertical: 13,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#a7f3d0',
});

const PrimaryButton = styled(Pressable)({
  paddingHorizontal: 20,
  paddingVertical: 13,
  borderRadius: 10,
  backgroundColor: '#059669',
});

const SecondaryButtonText = styled(Text)({ color: '#047857', fontWeight: '700' });
const PrimaryButtonText = styled(Text)({ color: '#ffffff', fontWeight: '700' });
