import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import type { RegionFeatureContent } from '../../controllers';

export function PlaceDetailDiscovery({ discovery }: { discovery: RegionFeatureContent }) {
  return (
    <Section>
      <ImageCard>
        <Image
          source={{ uri: discovery.imageUrl.replace(/^http:/, 'https:') }}
          resizeMode="cover"
          accessibilityLabel={discovery.title}
        />
      </ImageCard>

      <Content>
        <Heading>
          <SectionLabel>DISCOVERY</SectionLabel>
          <Title>{discovery.title}</Title>
        </Heading>
        <Description android_hyphenationFrequency="none" lineBreakStrategyIOS="hangul-word">
          {discovery.description}
        </Description>
      </Content>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 32,
  gap: 20,
});

const ImageCard = styled.View({
  width: '100%',
  aspectRatio: 12 / 7,
  overflow: 'hidden',
  backgroundColor: colors.gray[100],
  borderRadius: 16,

  ...createShadow(0, 1, 2, 0, withAlpha('#000000', 0.05)),
});

const Image = styled.Image({
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
});

const Content = styled.View({
  width: '100%',
  gap: 12,
});

const Heading = styled.View({
  width: '100%',
  gap: 8,
});

const SectionLabel = styled.Text({
  ...typography.caption1.medium,
  color: colors.gray[500],
});

const Title = styled.Text({
  ...typography.heading4.semibold,
  color: colors.gray[1000],
});

const Description = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});
