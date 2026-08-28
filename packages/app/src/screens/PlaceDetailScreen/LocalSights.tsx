import LandscapeImage1 from '@assets/images/mock/landscape/landscape1.png';
import LandscapeImage2 from '@assets/images/mock/landscape/landscape2.png';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import type { ImageSourcePropType } from 'react-native';

const localSights = [
  {
    image: LandscapeImage1,
    title: '관방제림 산책길',
    description: '300년 된 고목들이 줄지어 선 제방길을 따라 걷는 고즈넉한 오후의 산책.',
  },
  {
    image: LandscapeImage2,
    title: '죽순 전문 요리점',
    description: '담양의 정취를 미각으로 느끼는 시간.\n신선한 죽순과 담백한 떡갈비의 조화.',
  },
  {
    image: LandscapeImage1,
    title: '메타세쿼이아 길',
    description: '이국적이면서도 한국적인 정서가 공존하는 한국에서 가장 아름다운 거리.',
  },
];

export function PlaceDetailLocalSights() {
  return (
    <Section>
      <SectionLabel>LOCAL SIGHTS</SectionLabel>
      <List>
        {localSights.map((sight) => (
          <SightItem key={sight.title}>
            <Thumbnail
              source={sight.image as unknown as ImageSourcePropType}
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
