import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Platform } from 'react-native';
import { MyPageSectionLayout } from '../SectionLayout';
import KakaoIconPNG from '@assets/images/kakao.png';

export function MyPageAccountScreen() {
  return (
    <MyPageSectionLayout title="계정 정보">
      <AccountContent>
        <SectionLabel>로그인 방식</SectionLabel>

        <LoginCard>
          <KakaoIcon source={KakaoIconPNG} />
          <LoginText>카카오 로그인됨</LoginText>
        </LoginCard>

        <EmailCard>
          <SectionLabel>연결된 이메일</SectionLabel>
          <EmailRow>
            <Email>user@email.com</Email>
            <EditButton accessibilityRole="button" accessibilityLabel="연결 이메일 수정">
              <IconComponent name="pencil" size={20} color={colors.gray[500]} />
            </EditButton>
          </EmailRow>
        </EmailCard>
      </AccountContent>

      <WithdrawArea>
        <WithdrawButton accessibilityRole="button">
          <WithdrawText>서비스 탈퇴</WithdrawText>
        </WithdrawButton>
      </WithdrawArea>
    </MyPageSectionLayout>
  );
}

const AccountContent = styled.View({
  width: '100%',
  gap: 16,
  paddingTop: 28,
  paddingHorizontal: 20,
  paddingBottom: 12,
});

const SectionLabel = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[600],
});

const Card = styled.View({
  width: '100%',
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[50],

  ...Platform.select({
    web: { boxShadow: '0 0 20px rgba(8,25,29,0.05)' },
    android: { elevation: 3 },
  }),
});

const LoginCard = styled(Card)({
  flexDirection: 'row',
  alignItems: 'center',
  height: 72,
});

const KakaoIcon = styled.Image({
  width: 32,
  height: 32,
  borderRadius: 4,
});

const LoginText = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const EmailCard = styled(Card)({});

const EmailRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const Email = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const EditButton = styled.Pressable({
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});

const WithdrawArea = styled.View({
  width: '100%',
  paddingTop: 36,
  paddingBottom: 48,
  alignItems: 'center',
});

const WithdrawButton = styled.Pressable({});

const WithdrawText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[500],
  textDecorationLine: 'underline',
});
