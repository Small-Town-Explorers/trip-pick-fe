import styled from '@emotion/native';
import KakaoIcon from '@assets/images/kakao.png';
import { ActivityIndicator, type ImageSourcePropType } from 'react-native';
import { typography } from '@styles';

type KakaoButtonProps = {
  isLoading?: boolean;
  onPress: () => void;
};

export function KakaoButton({ isLoading = false, onPress }: KakaoButtonProps) {
  return (
    <Button
      accessibilityRole="button"
      accessibilityLabel="카카오톡으로 시작하기"
      disabled={isLoading}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#351B1D" />
      ) : (
        <KakaoLogo
          source={KakaoIcon as ImageSourcePropType}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      )}
      <Label>{isLoading ? '로그인하고 있어요' : '카카오톡으로 시작하기'}</Label>
    </Button>
  );
}

const Button = styled.Pressable({
  width: '100%',
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 8,
  backgroundColor: '#FEE500',
});

const KakaoLogo = styled.Image({
  width: 32,
  height: 32,
});

const Label = styled.Text({
  color: '#000000',
  ...typography.body2.semibold,
});
