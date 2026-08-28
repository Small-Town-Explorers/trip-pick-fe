import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useAppNavigation } from '../../navigation';
import { type PropsWithChildren } from 'react';

interface HeaderProps {
  title: string;
  sub?: string;
}

export const Header = ({ title, sub, children }: PropsWithChildren<HeaderProps>) => {
  const { back } = useAppNavigation();
  return (
    <Bar>
      <BackButton accessibilityRole="button" onPress={back}>
        <IconComponent name="carousel_left" color={colors.gray[400]} />
      </BackButton>
      <Title>
        <TitleText>{title}</TitleText>
        {sub ? <TitleSub>{sub}</TitleSub> : null}
      </Title>
      {children ? children : <HeaderSpacer />}
    </Bar>
  );
};

const Bar = styled.View({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[100],
  backgroundColor: 'white',
});

const BackButton = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 24,
  height: 24,
});

const Title = styled.View({
  flexDirection: 'row',
  gap: 8,
  alignItems: 'center',
});

const TitleText = styled.Text({
  ...typography.heading2.medium,
  color: colors.gray[1000],
});

const TitleSub = styled.Text({
  ...typography.body1.regular,
  color: colors.gray[400],
});

const HeaderSpacer = styled.View({
  width: 24,
  height: 24,
});
