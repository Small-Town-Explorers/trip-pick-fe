import styled from '@emotion/native';
import { colors, typography } from '@styles';
import type { RegionFeatureContent } from '../../controllers';

export function PlaceDetailLocalSights({ sights }: { sights: RegionFeatureContent[] }) {
  return (
    <Section>
      <SectionLabel>LOCAL SIGHTS</SectionLabel>
      <List>
        {sights.map((sight) => (
          <SightItem key={sight.title}>
            <Thumbnail
              source={{ uri: sight.imageUrl.replace(/^http:/, 'https:') }}
              resizeMode="cover"
              accessibilityLabel={sight.title}
            />
            <SightDetails>
              <Title>{sight.title}</Title>
              <Description>{sight.description}</Description>
            </SightDetails>
          </SightItem>
        ))}
      </List>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 32,
  gap: 24,
});

const SectionLabel = styled.Text({
  ...typography.caption1.medium,
  color: colors.gray[500],
});

const List = styled.View({
  width: '100%',
  gap: 32,
});

const SightItem = styled.View({
  width: '100%',
  minHeight: 88,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 20,
});

const Thumbnail = styled.Image({
  width: 88,
  height: 88,
  flexShrink: 0,
  backgroundColor: '#EEEEED',
  borderRadius: 8,
  resizeMode: 'cover',
});

const SightDetails = styled.View({
  flex: 1,
  minWidth: 0,
  gap: 8,
  paddingRight: 8,
});

const Title = styled.Text({
  ...typography.body1.medium,
  color: colors.gray[1000],
});

const Description = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[700],
});
