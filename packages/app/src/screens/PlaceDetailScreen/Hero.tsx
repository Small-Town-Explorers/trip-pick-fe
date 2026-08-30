import { LinearGradient } from '@components/LinearGradient';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { Platform } from 'react-native';

interface PlaceDetailHeroProps {
  title: string;
  summary: string;
  description: string;
  tag: string;
  imageUrl: string;
}

export function PlaceDetailHero({
  title,
  summary,
  description,
  tag,
  imageUrl,
}: PlaceDetailHeroProps) {
  return (
    <Section>
      <ImageBackground
        source={{ uri: imageUrl.replace(/^http:/, 'https:') }}
        resizeMode="cover"
        accessibilityLabel={`${title} 대표 풍경`}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={gradientStyle}
        />
        <Credit>사진 제공: 한국관광공사</Credit>
        <Tag>#{tag}</Tag>
        <Heading>
          <Title>{title}</Title>
          <Subtitle>{summary}</Subtitle>
        </Heading>
      </ImageBackground>

      <Introduction>
        <Quote>
          <QuoteText>&quot;{description}&quot;</QuoteText>
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
  backgroundColor: withAlpha('#000000', 0.29),
  borderRadius: 9999,

  ...typography.caption1.regular,
  color: colors.primary[50],

  ...Platform.select({
    web: {
      backdropFilter: 'blur(6px)',
    },
  }),
});

const Credit = styled.Text({
  position: 'absolute',
  top: 12,
  right: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: withAlpha('#000000', 0.42),
  borderRadius: 6,
  ...typography.caption3.regular,
  color: '#FFFFFF',
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
  color: withAlpha('#FFFFFF', 0.9),
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
