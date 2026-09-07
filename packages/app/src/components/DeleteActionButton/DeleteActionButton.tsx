import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import type { GestureResponderEvent } from 'react-native';

interface DeleteActionButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

export function DeleteActionButton({
  accessibilityLabel,
  disabled = false,
  fullWidth = false,
  onPress,
}: DeleteActionButtonProps) {
  return (
    <Button
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      fullWidth={fullWidth}
      onPress={onPress}
    >
      <Label>삭제</Label>
      <IconComponent name="delete" color={colors.semantic.warning} size={20} />
    </Button>
  );
}

const Button = styled.Pressable<{ fullWidth: boolean }>(({ fullWidth }) => ({
  width: fullWidth ? '100%' : 72,
  height: 42,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 12,
  paddingRight: 10,
  gap: 2,
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.15)),
}));

const Label = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[600],
});
