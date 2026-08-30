import styled from '@emotion/native';
import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';
import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import { colors, typography, withAlpha } from '@styles';
import { Platform } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';
import { useSmallCitiesQuery } from '../../queries';

export const HomeRecommendations = () => {
  const { navigate } = useAppNavigation();
  const { data: smallCities = [], isPending, isError, refetch } = useSmallCitiesQuery();
  const recommendations = smallCities.slice(0, 6);

  return (
    <Section>
      <Header>
        <Title>숨겨진 소도시의 고요한 발견</Title>
        <Desc>바쁜 일상을 뒤로하고, 자연의 속도에 맞춰 걷는 여행을 제안합니다.</Desc>
      </Header>
      {isPending ? (
        <Status accessibilityLiveRegion="polite">추천 소도시를 찾고 있어요.</Status>
      ) : isError ? (
        <ErrorArea>
          <Status>추천 소도시를 불러오지 못했어요.</Status>
          <RetryButton accessibilityRole="button" onPress={() => refetch()}>
            <RetryText>다시 시도</RetryText>
          </RetryButton>
        </ErrorArea>
      ) : (
        <Carousel
          horizontal
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          contentContainerStyle={carouselStyle}
        >
          {recommendations.map((city, index) => (
            <Card key={city.id} onPress={() => navigate(appRoutes.placeDetail(city.id))}>
              <Image
                source={
                  (index % 2 === 0 ? Landscape1Image : Landscape2Image) as ImageSourcePropType
                }
                accessibilityLabel={`${city.province} ${city.name}`}
              />
              <Tag>#{city.populationDeclineArea ? '인구감소지역' : '소도시'}</Tag>
              <Content>
                <CardTitle>
                  {city.province} {city.name}
                </CardTitle>
                <CardDesc>인구 {city.population.toLocaleString()}명의 작은 도시</CardDesc>
              </Content>
            </Card>
          ))}
        </Carousel>
      )}
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
  backgroundColor: withAlpha('#FFFFFF', 0.8),
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

const Status = styled.Text({
  paddingHorizontal: 20,
  paddingVertical: 24,
  ...typography.body3.regular,
  color: colors.gray[500],
});

const ErrorArea = styled.View({
  alignItems: 'flex-start',
});

const RetryButton = styled.Pressable({
  marginLeft: 20,
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});

const RetryText = styled.Text({
  ...typography.body3.medium,
  color: colors.primary[800],
});
