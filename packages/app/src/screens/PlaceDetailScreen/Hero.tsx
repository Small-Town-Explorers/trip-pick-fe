import HeroImageSource from '@assets/images/mock/landscape/landscape1.png';
import { LinearGradient } from '@components/LinearGradient';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Platform, type ImageSourcePropType } from 'react-native';

export function PlaceDetailHero() {
  return (
    <Section>
      <ImageBackground
        source={HeroImageSource as unknown as ImageSourcePropType}
        resizeMode="cover"
        accessibilityLabel="안개가 내려앉은 담양 대나무 숲"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={gradientStyle}
        />
        <Tag>#로컬체험</Tag>
        <Heading>
          <Title>전남 담양</Title>
          <Subtitle>대나무 숲의 고요한 숨결</Subtitle>
        </Heading>
      </ImageBackground>

      <Introduction>
        <Quote>
          <QuoteText>
            &quot;바람이 불어오면 숲은 스스로의 목소리를 냅니다. 번잡한 도시의 소음 대신, 대나무
            잎사귀가 부딪히는 소리에 귀를 기울여 보세요. 이곳은 시간이 느리게 흐르는, 당신만을 위한
            도피처입니다.&quot;
          </QuoteText>
        </Quote>
      </Introduction>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
});

const ImageBackground = styled.ImageBackground({
  position: 'relative',
  width: '100%',
  aspectRatio: 1,
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: 28,
  gap: 12,
  overflow: 'hidden',
});

const gradientStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;

const Tag = styled.Text({
  paddingHorizontal: 12,
  paddingVertical: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.29)',
  borderRadius: 9999,

  ...typography.caption1.regular,
  color: colors.primary[50],

  ...Platform.select({
    web: {
      backdropFilter: 'blur(6px)',
    },
  }),
});

const Heading = styled.View({
  gap: 8,
});

const Title = styled.Text({
  fontFamily: 'Pretendard',
  fontSize: 32,
  fontWeight: '700',
  lineHeight: 40,
  letterSpacing: -0.32,
  color: '#FFFFFF',
});

const Subtitle = styled.Text({
  ...typography.heading2.medium,
  color: 'rgba(255, 255, 255, 0.9)',
});

const Introduction = styled.View({
  width: '100%',
  minHeight: 184,
  paddingHorizontal: 20,
  paddingVertical: 32,
});

const Quote = styled.View({
  width: '100%',
  justifyContent: 'center',
  paddingLeft: 20,
  borderLeftWidth: 2,
  borderLeftColor: colors.gray[700],
});

const QuoteText = styled.Text({
  ...typography.body1.regular,
  color: colors.gray[800],
});
