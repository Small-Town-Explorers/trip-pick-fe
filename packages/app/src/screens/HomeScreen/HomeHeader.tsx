import styled from '@emotion/native';
import logoImage from '@assets/images/logo.png';
import { IconComponent } from '@components/Icons';
import { colors, typography } from '@styles';
import type { ImageSourcePropType } from 'react-native';

export function HomeHeader() {
  return (
    <Header>
      <LogoContainer>
        <Logo
          source={logoImage as ImageSourcePropType}
          resizeMode="contain"
          accessibilityLabel="Trip Pick 로고"
        />
        <LogoText>소도시로</LogoText>
      </LogoContainer>
      <HeaderMenu>
        <HeaderMenuItem>
          <HeaderMenuItemIcon>
            <IconComponent name="folder" color={colors.primary[700]} />
          </HeaderMenuItemIcon>
          <HeaderMenuItemText>내 여행</HeaderMenuItemText>
        </HeaderMenuItem>
        <HeaderMenuItem>
          <HeaderMenuItemIcon>
            <IconComponent name="profile" color={colors.primary[700]} />
          </HeaderMenuItemIcon>
          <HeaderMenuItemText>MY</HeaderMenuItemText>
        </HeaderMenuItem>
      </HeaderMenu>
    </Header>
  );
}

const Header = styled.View({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[100],
});

const LogoContainer = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const Logo = styled.Image({
  width: 36,
  height: 36,
});

const LogoText = styled.Text({
  fontSize: 24,
  fontWeight: '500',
  color: '#000000',
});

const HeaderMenu = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const HeaderMenuItem = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const HeaderMenuItemIcon = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 28,
  height: 28,
  gap: 4,
});

const HeaderMenuItemText = styled.Text({
  ...typography.caption3.regular,
  color: colors.gray[500],
});
