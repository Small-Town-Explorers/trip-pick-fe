import DiscoveryImageSource from '@assets/images/mock/landscape/landscape2.png';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Platform, type ImageSourcePropType } from 'react-native';

export function PlaceDetailDiscovery() {
  return (
    <Section>
      <ImageCard>
        <Image
          source={DiscoveryImageSource as unknown as ImageSourcePropType}
          resizeMode="cover"
          accessibilityLabel="대나무 숲속의 연지각"
        />
      </ImageCard>

      <Content>
        <Heading>
          <SectionLabel>DISCOVERY</SectionLabel>
          <Title>숲 속의 비밀 서재, &apos;연지각&apos;</Title>
        </Heading>
        <Description android_hyphenationFrequency="none" lineBreakStrategyIOS="hangul-word">
          {
            '죽녹원 가장 깊은 곳에 위치한 연지각은 아는 사람만 찾아가는 작은 쉼터입니다. 이곳에서 제공하는 댓잎차 한 잔과 함께라면, 복잡했던 생각들이 대나무 숲의 바람 속으로 흩어지는 경험을 할 수 있습니다.\n정오 무렵의 빛이 가장 아름답게 스며듭니다.'
          }
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

  ...Platform.select({
    web: {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    android: {
      elevation: 1,
      shadowColor: '#000000',
    },
  }),
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
