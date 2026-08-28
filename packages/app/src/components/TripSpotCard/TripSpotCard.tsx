import KakaoMapIcon from '@assets/images/kakao_map.png';
import styled from '@emotion/native';
import { colors, shadows, typography } from '@styles';
import { Linking, type ImageSourcePropType } from 'react-native';

interface TripSpotCardProps {
  image: ImageSourcePropType;
  type: string;
  name: string;
  description: string;
  mapUrl?: string;
}

export function TripSpotCard({ image, type, name, description, mapUrl }: TripSpotCardProps) {
  const openMap = async () => {
    if (!mapUrl) return;

    const supported = await Linking.canOpenURL(mapUrl);
    if (!supported) {
      console.warn(`열 수 없는 지도 주소입니다: ${mapUrl}`);
      return;
    }

    await Linking.openURL(mapUrl);
  };

  return (
    <Card>
      <Thumbnail source={image} accessibilityLabel={name} resizeMode="cover" />
      <Info>
        <Meta>
          <Type>{type}</Type>
          {mapUrl ? (
            <MapButton
              accessibilityRole="link"
              accessibilityLabel={`${name} 카카오맵 열기`}
              onPress={openMap}
            >
              <MapIcon
                source={KakaoMapIcon as unknown as ImageSourcePropType}
                accessibilityLabel="카카오맵"
                resizeMode="cover"
              />
            </MapButton>
          ) : null}
        </Meta>
        <Name numberOfLines={1}>{name}</Name>
        <Description numberOfLines={2}>{description}</Description>
      </Info>
    </Card>
  );
}

const Card = styled.View({
  flex: 1,
  minWidth: 0,
  height: 120,
  padding: 16,
  flexDirection: 'row',
  gap: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,

  ...shadows[2],
});

const Thumbnail = styled.Image({
  width: 87,
  height: 87,
  flexShrink: 0,
  borderRadius: 8,
});

const Info = styled.View({
  flex: 1,
  minWidth: 0,
  gap: 6,
});

const Meta = styled.View({
  height: 22,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
});

const Type = styled.Text({
  alignSelf: 'flex-start',
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
  ...typography.caption2.regular,
  color: colors.primary[900],
});

const MapButton = styled.Pressable({
  width: 22,
  height: 22,
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: 9999,
});

const MapIcon = styled.Image({
  width: '100%',
  height: '100%',
});

const Name = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const Description = styled.Text({
  flexShrink: 1,
  width: '100%',
  ...typography.caption1.regular,
  color: colors.gray[700],
});
