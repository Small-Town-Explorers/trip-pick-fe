import styled from '@emotion/native';
import { Pressable, Text, View } from 'react-native';
import { useAppNavigation } from '../../navigation';

export function TestTwoScreen() {
  const { back, navigate } = useAppNavigation();

  return (
    <Container>
      <Badge>TEST PAGE 02</Badge>
      <Title>여행 준비가 완료됐어요</Title>
      <Description>화면 이동과 공유 UI 패키지가 정상적으로 동작하고 있습니다.</Description>

      <StatusCard>
        <StatusIcon>✓</StatusIcon>
        <StatusContent>
          <StatusTitle>연결 상태 정상</StatusTitle>
          <StatusDescription>Web · iOS · Android 공통 화면</StatusDescription>
        </StatusContent>
      </StatusCard>

      <ButtonRow>
        <SecondaryButton accessibilityRole="button" onPress={back}>
          <SecondaryButtonText>이전 페이지</SecondaryButtonText>
        </SecondaryButton>
        <PrimaryButton accessibilityRole="button" onPress={() => navigate('/')}>
          <PrimaryButtonText>처음으로</PrimaryButtonText>
        </PrimaryButton>
      </ButtonRow>
    </Container>
  );
}

const Container = styled(View)({
  flex: 1,
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  backgroundColor: '#eff6ff',
});

const Badge = styled(Text)({
  marginBottom: 16,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  color: '#1d4ed8',
  backgroundColor: '#dbeafe',
  fontSize: 12,
  fontWeight: '700',
});

const Title = styled(Text)({
  color: '#1e3a8a',
  fontSize: 34,
  fontWeight: '800',
  textAlign: 'center',
});

const Description = styled(Text)({
  marginTop: 12,
  color: '#475569',
  fontSize: 17,
  lineHeight: 26,
  textAlign: 'center',
});

const StatusCard = styled(View)({
  width: '100%',
  maxWidth: 480,
  marginTop: 32,
  padding: 22,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  borderRadius: 18,
  backgroundColor: '#ffffff',
});

const StatusIcon = styled(Text)({
  width: 48,
  height: 48,
  borderRadius: 24,
  color: '#ffffff',
  backgroundColor: '#2563eb',
  fontSize: 26,
  fontWeight: '800',
  lineHeight: 48,
  textAlign: 'center',
});

const StatusContent = styled(View)({ flex: 1, gap: 4 });
const StatusTitle = styled(Text)({ color: '#1e293b', fontSize: 18, fontWeight: '700' });
const StatusDescription = styled(Text)({ color: '#64748b', fontSize: 14 });
const ButtonRow = styled(View)({ flexDirection: 'row', gap: 12, marginTop: 32 });

const SecondaryButton = styled(Pressable)({
  paddingHorizontal: 20,
  paddingVertical: 13,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#bfdbfe',
});

const PrimaryButton = styled(Pressable)({
  paddingHorizontal: 20,
  paddingVertical: 13,
  borderRadius: 10,
  backgroundColor: '#2563eb',
});

const SecondaryButtonText = styled(Text)({ color: '#1d4ed8', fontWeight: '700' });
const PrimaryButtonText = styled(Text)({ color: '#ffffff', fontWeight: '700' });
