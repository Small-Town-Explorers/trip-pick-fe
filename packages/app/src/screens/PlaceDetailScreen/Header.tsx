import styled from '@emotion/native';
import { IconComponent } from '@components/Icons';
import { colors, typography } from '@styles';
import { useAppNavigation } from '../../navigation';

export const PlaceDetailHeader = () => {
  const { back } = useAppNavigation();

  return (
    <Bar>
      <BackButton accessibilityRole="button" accessibilityLabel="뒤로 가기" onPress={back}>
        <IconComponent name="carousel_left" color={colors.gray[400]} />
      </BackButton>
      <Title>숨겨진 소도시의 고요한 발견</Title>
      <HeaderSpacer />
    </Bar>
  );
};

const Bar = styled.View({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[100],
});

const BackButton = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
});

const Title = styled.Text({
  ...typography.heading2.medium,
  color: colors.gray[1000],
});

const HeaderSpacer = styled.View({
  width: 24,
  height: 24,
});
