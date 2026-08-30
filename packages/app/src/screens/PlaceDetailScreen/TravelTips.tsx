import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

export function PlaceDetailTravelTips({ tips }: { tips: string[] }) {
  return (
    <Section>
      <Card>
        <GuideHeader>
          <SectionLabel>RUSTIC TIPS</SectionLabel>
          <TitleRow>
            <TravelIcon>
              <IconComponent name="travel" color={colors.primary[800]} />
            </TravelIcon>
            <Title>촌캉스 가이드</Title>
          </TitleRow>
        </GuideHeader>

        <TipList>
          {tips.map((tip, tipIndex) => (
            <TipItem key={tip}>
              <TipNumber>{String(tipIndex + 1).padStart(2, '0')}</TipNumber>
              <TipDescription>{tip}</TipDescription>
            </TipItem>
          ))}
        </TipList>
      </Card>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 32,
});

const Card = styled.View({
  width: '100%',
  padding: 24,
  gap: 24,
  backgroundColor: colors.gray[25],
  borderRadius: 8,
});

const GuideHeader = styled.View({
  width: '100%',
  gap: 8,
});

const SectionLabel = styled.Text({
  ...typography.caption1.medium,
  color: colors.gray[500],
});

const TitleRow = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const TravelIcon = styled.View({
  width: 20,
  aspectRatio: 1,
});

const Title = styled.Text({
  ...typography.heading4.semibold,
  color: colors.gray[900],
});

const TipList = styled.View({
  width: '100%',
  gap: 24,
});

const TipItem = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
});

const TipNumber = styled.Text({
  flexShrink: 0,
  ...typography.body3.semibold,
  color: colors.gray[300],
});

const TipDescription = styled.Text({
  flex: 1,
  minWidth: 0,
  ...typography.body2.regular,
  color: colors.gray[700],
});
