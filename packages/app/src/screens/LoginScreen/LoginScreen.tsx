import styled from '@emotion/native';
import LoginBackgroundImage from '@assets/images/login_background.png';
import LoginBrandImage from '@assets/images/logo_button.png';
import { KakaoButton } from '@components/Buttons';
import { LinearGradient } from '@components/LinearGradient';
import { type ImageSourcePropType } from 'react-native';
import { colors, fontFamilies, typography } from '@styles';

type LoginScreenProps = {
  isLoading?: boolean;
  errorMessage?: string;
  onKakaoLogin: () => void;
  onGuestContinue: () => void;
};

export function LoginScreen({
  isLoading = false,
  errorMessage,
  onKakaoLogin,
  onGuestContinue,
}: LoginScreenProps) {
  return (
    <Screen>
      <Introduction>
        <Background
          source={LoginBackgroundImage as ImageSourcePropType}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <BackgroundFade colors={['rgba(255, 255, 255, 0)', '#FFFFFF']} locations={[0, 1]} />
        <Brand>
          <BrandLogo
            source={LoginBrandImage as ImageSourcePropType}
            resizeMode="contain"
            accessibilityLabel="소도시로 로고"
            accessibilityIgnoresInvertColors
          />
          <BrandName>소도시로</BrandName>
        </Brand>
        <Copy>
          <Title>가볍게 떠나요,{`\n`}나만의 소도시 여행</Title>
          <Description>
            숨은 여행지를 발견하고,{`\n`}취향에 맞는 코스를 AI로 간편하게 만들어 보세요.
          </Description>
        </Copy>
      </Introduction>

      <Actions>
        {errorMessage ? (
          <ErrorMessage accessibilityLiveRegion="assertive">{errorMessage}</ErrorMessage>
        ) : null}
        <KakaoButton isLoading={isLoading} onPress={onKakaoLogin} />
        <GuestButton
          accessibilityRole="button"
          accessibilityLabel="비회원으로 이용하기"
          onPress={onGuestContinue}
        >
          <GuestButtonText>비회원으로 이용하기</GuestButtonText>
        </GuestButton>
      </Actions>
    </Screen>
  );
}

const Screen = styled.View({
  position: 'relative',
  flex: 1,
  width: '100%',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
});

const Introduction = styled.View({
  position: 'relative',
  alignItems: 'center',
  marginVertical: 'auto',
  paddingVertical: 24,
  paddingHorizontal: 20,
  gap: 36,
});

const Background = styled.Image({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  aspectRatio: 9 / 16,
  opacity: 0.25,
});

const BackgroundFade = styled(LinearGradient)({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  height: '100%',
});

const Brand = styled.View({
  alignItems: 'center',
  gap: 12,
});

const BrandLogo = styled.Image({
  width: 111,
  height: 111,
});

const BrandName = styled.Text({
  fontFamily: fontFamilies.twayNalda,
  fontSize: 40,
  fontWeight: '400',
  lineHeight: 40 * 1.3,
  letterSpacing: 0.1,
  color: colors.primary[800],
  textAlign: 'center',
});

const Copy = styled.View({
  gap: 24,
  alignItems: 'center',
});

const Title = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
  textAlign: 'center',
});

const Description = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
  textAlign: 'center',
});

const Actions = styled.View({
  paddingTop: 24,
  paddingHorizontal: 20,
  paddingBottom: 28,
  gap: 20,
});

const ErrorMessage = styled.Text({
  marginBottom: 10,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  backgroundColor: colors.semantic.warningDisabled,
  color: '#B8321A',
  ...typography.body3.regular,
  textAlign: 'center',
});

const GuestButton = styled.Pressable({
  alignSelf: 'center',
});

const GuestButtonText = styled.Text({
  color: colors.gray[400],
  ...typography.body3.regular,
  textDecorationLine: 'underline',
});
