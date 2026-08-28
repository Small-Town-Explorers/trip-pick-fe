import { IconComponent, type IconName } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { type PropsWithChildren } from 'react';
import { Platform, type GestureResponderEvent } from 'react-native';

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
      <IconComponent name={icon} size={20} color={colors.primary[200]} />
      <Label>{children}</Label>
    </Button>
  );
}

const Button = styled.Pressable({
  width: '100%',
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: colors.primary[1000],
  borderRadius: 9999,

  ...Platform.select({
    web: {
      boxShadow: `0 10px 30px ${withAlpha(colors.gray[1000], 0.15)}`,
    },
    ios: {
      shadowColor: '#08191D',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
    },
    android: {
      elevation: 6,
      shadowColor: '#08191D',
    },
  }),
});

const Label = styled.Text({
  ...typography.body1.semibold,
  color: '#FFFFFF',
  textAlign: 'center',
});
