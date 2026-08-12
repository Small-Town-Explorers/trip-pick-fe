import { type IconName, IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

export const IconButton = ({ icon, children }: PropsWithChildren<{ icon: IconName }>) => {
  return (
    <Button>
      <ButtonIcon>
        <IconComponent name={icon} color={colors.primary[200]} />
      </ButtonIcon>
      <ButtonText>{children}</ButtonText>
    </Button>
  );
};

const Button = styled.Pressable({
  width: '100%',
  flexDirection: 'row',
  backgroundColor: colors.primary[1000],
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
  borderRadius: 9999,
  gap: 8,

  ...Platform.select({
    web: {
      boxShadow: '0 10px 30px rgba(8, 25, 29, 0.15)',
    },
    ios: {
      shadowColor: '#08191D',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    android: {
      elevation: 6,
      shadowColor: '#08191D',
    },
  }),
});

const ButtonIcon = styled.View({
  width: 20,
  height: 20,
});

const ButtonText = styled.Text({
  ...typography.body1.semibold,
  color: '#FFFFFF',
});
