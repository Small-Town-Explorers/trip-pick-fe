import { IconComponent, type IconName } from '@components/Icons';
import styled from '@emotion/native';
import { colors, shadows, typography, withAlpha } from '@styles';
import { type PropsWithChildren } from 'react';
import { type GestureResponderEvent } from 'react-native';

interface CourseCreateButtonProps extends PropsWithChildren {
  disabled?: boolean;
  icon?: IconName;
  onPress?: ((event: GestureResponderEvent) => void) | null;
}

export function CourseCreateButton({
  children,
  disabled = false,
  icon = 'ai',
  onPress,
}: CourseCreateButtonProps) {
  return (
    <Button
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      <IconComponent
        name={icon}
        size={20}
        color={disabled ? colors.gray[200] : colors.primary[200]}
      />
      <Label disabled={disabled}>{children}</Label>
    </Button>
  );
}

const Button = styled.Pressable(({ disabled }: { disabled: boolean }) => ({
  width: '100%',
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: disabled ? withAlpha(colors.primary[1000], 0.1) : colors.primary[1000],
  borderRadius: 9999,

  ...(disabled ? {} : shadows.shadow1),
}));

const Label = styled.Text(({ disabled }: { disabled: boolean }) => ({
  ...typography.body1.semibold,
  color: disabled ? colors.gray[300] : '#FFFFFF',
  textAlign: 'center',
}));
