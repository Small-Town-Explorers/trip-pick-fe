import styled from '@emotion/native';
import { ActivityIndicator } from 'react-native';
import { colors, typography } from '@styles';

type LoginScreenProps = {
  isLoading?: boolean;
  errorMessage?: string;
  onKakaoLogin: () => void;
};

export function LoginScreen({ isLoading = false, errorMessage, onKakaoLogin }: LoginScreenProps) {
  return (
    <Screen>
      <Hero>
        <Brand accessibilityLabel="Trip Pick 소도시로">
          <BrandMark>
            <BrandInitial>T</BrandInitial>
          </BrandMark>
          <BrandName>소도시로</BrandName>
        </Brand>

        <Copy>
          <Eyebrow>TRIP PICK</Eyebrow>
          <Title>가볍게 떠나는{`\n`}나만의 소도시 여행</Title>
          <Description>
            숨은 여행지를 발견하고, 취향에 맞는 코스를 간편하게 만들어 보세요.
          </Description>
        </Copy>

        <Landscape pointerEvents="none">
          <Sun />
          <BackHill />
          <FrontHill />
          <Road />
        </Landscape>
      </Hero>

      <Actions>
        {isLoading ? (
          <Loading accessibilityLiveRegion="polite">
            <ActivityIndicator size="small" color={colors.primary[700]} />
            <LoadingTitle>로그인하고 있어요</LoadingTitle>
            <LoadingDescription>잠시만 기다려 주세요.</LoadingDescription>
          </Loading>
        ) : (
          <>
            {errorMessage ? (
              <ErrorMessage accessibilityLiveRegion="assertive">{errorMessage}</ErrorMessage>
            ) : null}
            <KakaoButton
              accessibilityRole="button"
              accessibilityLabel="카카오로 시작하기"
              onPress={onKakaoLogin}
            >
              <KakaoSymbol>●</KakaoSymbol>
              <KakaoButtonText>카카오로 시작하기</KakaoButtonText>
            </KakaoButton>
            <Terms>로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.</Terms>
          </>
        )}
      </Actions>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, minHeight: '100%', backgroundColor: '#FFFFFF' });
const Hero = styled.View({
  position: 'relative',
  minHeight: 610,
  overflow: 'hidden',
  paddingTop: 28,
  paddingHorizontal: 24,
  backgroundColor: '#EDF7E8',
});
const Brand = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 9 });
const BrandMark = styled.View({
  width: 34,
  height: 34,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 11,
  borderBottomLeftRadius: 3,
  backgroundColor: colors.primary[700],
});
const BrandInitial = styled.Text({ color: '#FFFFFF', fontSize: 20, fontWeight: '700' });
const BrandName = styled.Text({ ...typography.body1.semibold, color: colors.primary[1000] });
const Copy = styled.View({ zIndex: 2, marginTop: 76 });
const Eyebrow = styled.Text({
  ...typography.caption1.medium,
  color: colors.primary[700],
  letterSpacing: 1.9,
});
const Title = styled.Text({
  marginTop: 12,
  color: '#163E35',
  fontSize: 36,
  fontWeight: '600',
  lineHeight: 46,
  letterSpacing: -1.4,
});
const Description = styled.Text({
  width: 310,
  marginTop: 16,
  ...typography.body3.regular,
  color: colors.gray[600],
  lineHeight: 24,
});
const Landscape = styled.View({ position: 'absolute', right: 0, bottom: 0, left: 0, height: 250 });
const Sun = styled.View({
  position: 'absolute',
  top: 19,
  right: 55,
  width: 62,
  height: 62,
  borderRadius: 31,
  backgroundColor: '#FFD98A',
});
const BackHill = styled.View({
  position: 'absolute',
  bottom: -120,
  left: -135,
  width: 520,
  height: 310,
  borderRadius: 260,
  backgroundColor: colors.primary[300],
  transform: [{ rotate: '-7deg' }],
});
const FrontHill = styled.View({
  position: 'absolute',
  right: -185,
  bottom: -120,
  width: 560,
  height: 330,
  borderRadius: 280,
  backgroundColor: colors.primary[500],
  transform: [{ rotate: '9deg' }],
});
const Road = styled.View({
  position: 'absolute',
  bottom: -68,
  left: '43%',
  width: 84,
  height: 250,
  borderRadius: 42,
  backgroundColor: '#F5EDD9',
  transform: [{ rotate: '8deg' }],
});
const Actions = styled.View({
  zIndex: 3,
  minHeight: 172,
  marginTop: -18,
  paddingTop: 34,
  paddingHorizontal: 24,
  paddingBottom: 30,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  backgroundColor: '#FFFFFF',
});
const KakaoButton = styled.Pressable({
  width: '100%',
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  borderRadius: 14,
  backgroundColor: '#FEE500',
});
const KakaoSymbol = styled.Text({ color: '#191919', fontSize: 15, transform: [{ scaleX: 1.25 }] });
const KakaoButtonText = styled.Text({ ...typography.body2.semibold, color: 'rgba(0, 0, 0, 0.85)' });
const Terms = styled.Text({
  maxWidth: 330,
  marginTop: 16,
  alignSelf: 'center',
  ...typography.caption2.regular,
  color: colors.gray[400],
  lineHeight: 17,
  textAlign: 'center',
});
const ErrorMessage = styled.Text({
  marginBottom: 14,
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: colors.semantic.warningDisabled,
  color: '#B8321A',
  ...typography.body3.regular,
  textAlign: 'center',
});
const Loading = styled.View({ minHeight: 90, alignItems: 'center', gap: 5 });
const LoadingTitle = styled.Text({
  marginTop: 6,
  ...typography.body2.semibold,
  color: colors.gray[900],
});
const LoadingDescription = styled.Text({ ...typography.body3.regular, color: colors.gray[600] });
