import styled from '@emotion/native';
import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';
import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import { colors, typography } from '@styles';
import { Platform } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

const FirstMock = [
  {
    image: Landscape1Image,
    title: '전남 담양',
    description: '대나무 숲의 고요한 숨결',
    tag: '로컬체험',
  },
  {
    image: Landscape2Image,
    title: '경남 하동',
    description: '녹차 향기 머무는 산자락',
    tag: '힐링',
  },
];

export const HomeRecommendation = () => {
  return (
    <RecommendationSection>
      <RecommendationHeader>
        <RecommendationTitle>숨겨진 소도시의 고요한 발견</RecommendationTitle>
        <RecommendationDescription>
          바쁜 일상을 뒤로하고, 자연의 속도에 맞춰 걷는 여행을 제안합니다.
        </RecommendationDescription>
      </RecommendationHeader>
      <RecommendationCarousel
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={recommendationCarouselContentStyle}
      >
        {FirstMock.map((item, index) => (
          <RecommendationCard key={index}>
            <RecommendationImage source={item.image as ImageSourcePropType} alt={item.title} />
            <RecommendationTag>#{item.tag}</RecommendationTag>
            <RecommendationContent>
              <RecommendationCardTitle>{item.title}</RecommendationCardTitle>
              <RecommendationCardDescription>{item.description}</RecommendationCardDescription>
            </RecommendationContent>
          </RecommendationCard>
        ))}
      </RecommendationCarousel>
    </RecommendationSection>
  );
};

const RecommendationSection = styled.View({
  width: '100%',
  paddingTop: 24,
  paddingBottom: 20,
  gap: 16,
});

const RecommendationHeader = styled.View({
  gap: 12,
  paddingHorizontal: 20,
});

const RecommendationTitle = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const RecommendationDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});

const RecommendationCarousel = styled.ScrollView({
  width: '100%',
});

const recommendationCarouselContentStyle = {
  gap: 16,
  paddingHorizontal: 20,
} as const;

const RecommendationCard = styled.Pressable({
  width: 200,
  gap: 12,
  paddingBottom: 20,
});

const RecommendationImage = styled.Image({
  width: '100%',
  aspectRatio: '3 / 4',
  borderRadius: 12,
  resizeMode: 'cover',
});

const RecommendationTag = styled.Text({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 9999,
  ...typography.caption1.regular,
  color: colors.primary[1000],
});

const RecommendationContent = styled.View({
  gap: 8,
});

const RecommendationCardTitle = styled.Text({
  ...typography.heading4.medium,
  color: colors.gray[1000],
});

const RecommendationCardDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
});
