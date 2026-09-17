import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { sendTestNotification } from '../../notifications/courseReminders';

export function TestNotificationButton() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const send = async () => {
    if (isSending) return;
    setIsSending(true);
    setMessage('');
    setIsError(false);

    try {
      await sendTestNotification();
      setMessage('테스트 알림을 보냈어요.');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : '테스트 알림을 보내지 못했어요.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>테스트 알림</Title>
        <Description>현재 휴대폰에서 알림이 정상적으로 표시되는지 확인합니다.</Description>
      </Content>
      <Button accessibilityRole="button" disabled={isSending} onPress={() => void send()}>
        {isSending ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <ButtonText>보내기</ButtonText>
        )}
      </Button>
      {message ? (
        <Result accessibilityLiveRegion="polite" error={isError}>
          {message}
        </Result>
      ) : null}
    </Container>
  );
}

const Container = styled.View({
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});

const Content = styled.View({ gap: 6 });
const Title = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const Description = styled.Text({ ...typography.body3.regular, color: colors.gray[600] });
const Button = styled.Pressable({
  height: 42,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary[700],
  borderRadius: 8,
});
const ButtonText = styled.Text({ ...typography.body2.semibold, color: '#FFFFFF' });
const Result = styled.Text<{ error: boolean }>(({ error }) => ({
  ...typography.caption1.regular,
  color: error ? colors.semantic.warning : colors.primary[700],
}));
