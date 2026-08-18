import styled from '@emotion/native';
import { IconComponent } from '@components/Icons';
import { colors, typography } from '@styles';
import { useAppNavigation } from '../../navigation';

export const TripDetailHeader = () => {
  const { back } = useAppNavigation();
  return (
    <Bar>
      <IconSlot onPress={() => back()}>
        <IconComponent name="carousel_left" color={colors.gray[400]} />
      </IconSlot>
      <Title>내 여행 상세</Title>
      <IconSlot>
        <IconComponent name="share" color={colors.gray[900]} />
      </IconSlot>
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

const IconSlot = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
  gap: 4,
});

const Title = styled.Text({
  ...typography.heading2.medium,
  color: colors.gray[1000],
});
