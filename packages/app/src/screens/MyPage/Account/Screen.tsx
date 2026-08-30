import KakaoIconPNG from '@assets/images/kakao.png';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { ActivityIndicator, type ImageSourcePropType } from 'react-native';
import { useAccountInfoQuery } from '../../../queries';
import { MyPageSectionLayout } from '../SectionLayout';

export function MyPageAccountScreen() {
  const { data: account, error, isPending, refetch } = useAccountInfoQuery();

  return (
    <MyPageSectionLayout title="계정 정보">
      <AccountContent>
        <SectionLabel>로그인 방식</SectionLabel>

        {isPending ? (
          <StateCard accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.primary[700]} />
            <StateText>계정 정보를 불러오고 있어요.</StateText>
          </StateCard>
        ) : error || !account ? (
          <StateCard>
            <StateText>
              {error instanceof Error ? error.message : '계정 정보를 불러오지 못했어요.'}
            </StateText>
            <RetryButton accessibilityRole="button" onPress={() => refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </StateCard>
        ) : (
          <LoginCard>
            {account.provider === 'KAKAO' ? (
              <KakaoIcon source={KakaoIconPNG as ImageSourcePropType} />
            ) : null}
            <LoginText>
              {account.provider === 'KAKAO' ? '카카오 로그인됨' : `${account.provider} 로그인됨`}
            </LoginText>
          </LoginCard>
        )}

        <Guide>연결된 이메일 정보는 현재 제공되지 않습니다.</Guide>
      </AccountContent>
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

const SectionLabel = styled.Text({ ...typography.body3.medium, color: colors.gray[600] });

const Card = styled.View({
  width: '100%',
  minHeight: 72,
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[50],
  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.05)),
});

const LoginCard = styled(Card)({ flexDirection: 'row', alignItems: 'center' });
const KakaoIcon = styled.Image({ width: 32, height: 32, borderRadius: 4 });
const LoginText = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const Guide = styled.Text({ ...typography.body3.regular, color: colors.gray[500] });

const StateCard = styled(Card)({ alignItems: 'center', justifyContent: 'center' });
const StateText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });
