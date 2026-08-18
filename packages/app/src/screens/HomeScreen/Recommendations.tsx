import styled from '@emotion/native';
import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';
import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import { colors, typography } from '@styles';
import { Platform } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';

const recommendations = [
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

export const HomeRecommendations = () => {
  const { navigate } = useAppNavigation();

  return (
    <Section>
      <Header>
        <Title>숨겨진 소도시의 고요한 발견</Title>
        <Desc>바쁜 일상을 뒤로하고, 자연의 속도에 맞춰 걷는 여행을 제안합니다.</Desc>
      </Header>
      <Carousel
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={carouselStyle}
      >
        {recommendations.map((place) => (
          <Card key={place.title} onPress={() => navigate(appRoutes.placeDetail('test'))}>
            <Image source={place.image as ImageSourcePropType} alt={place.title} />
            <Tag>#{place.tag}</Tag>
            <Content>
              <CardTitle>{place.title}</CardTitle>
              <CardDesc>{place.description}</CardDesc>
            </Content>
          </Card>
        ))}
      </Carousel>
    </Section>
  );
};

const Section = styled.View({
  width: '100%',
  paddingTop: 24,
  paddingBottom: 20,
  gap: 16,
});

const Header = styled.View({
  gap: 12,
  paddingHorizontal: 20,
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const Desc = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});

const Carousel = styled.ScrollView({
  width: '100%',
});

const carouselStyle = {
  gap: 16,
  paddingHorizontal: 20,
} as const;

const Card = styled.Pressable({
  width: 200,
  gap: 12,
  paddingBottom: 20,
});

const Image = styled.Image({
  width: '100%',
  aspectRatio: '3 / 4',
  borderRadius: 12,
  resizeMode: 'cover',
});

const Tag = styled.Text({
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

const Content = styled.View({
  gap: 8,
});

const CardTitle = styled.Text({
  ...typography.heading4.medium,
  color: colors.gray[1000],
});

const CardDesc = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
});
