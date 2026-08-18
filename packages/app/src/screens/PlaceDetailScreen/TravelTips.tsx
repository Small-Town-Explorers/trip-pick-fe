import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

const travelTips = [
  '스마트폰은 잠시 가방 깊숙이 넣어두세요. 아날로그 책 한 권이 더 좋은 친구가 됩니다.',
  '새벽 6시의 공기를 마셔보세요. 대나무 숲이 내뿜는 가장 맑은 산소를 만날 수 있습니다.',
  '편안한 리넨 소재의 옷을 챙기세요. 자연의 질감과 가장 잘 어울리는 선택입니다.',
];

export function PlaceDetailTravelTips() {
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
          {travelTips.map((tip, tipIndex) => (
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
