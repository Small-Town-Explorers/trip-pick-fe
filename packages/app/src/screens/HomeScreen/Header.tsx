import styled from '@emotion/native';
import logoImage from '@assets/images/logo.png';
import { IconComponent } from '@components/Icons';
import { colors, typography } from '@styles';
import type { ImageSourcePropType } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';

export function HomeHeader() {
  const { navigate } = useAppNavigation();

  return (
    <Bar>
      <Brand>
        <Logo
          source={logoImage as ImageSourcePropType}
          resizeMode="contain"
          accessibilityLabel="Trip Pick 로고"
        />
        <BrandText>소도시로</BrandText>
      </Brand>
      <Menu>
        <MenuItem accessibilityRole="button" onPress={() => navigate(appRoutes.myTrips)}>
          <MenuIcon>
            <IconComponent name="folder" color={colors.primary[700]} />
          </MenuIcon>
          <MenuText>내 여행</MenuText>
        </MenuItem>
        <MenuItem accessibilityRole="button" onPress={() => navigate(appRoutes.myPage)}>
          <MenuIcon>
            <IconComponent name="profile" color={colors.primary[700]} />
          </MenuIcon>
          <MenuText>MY</MenuText>
        </MenuItem>
      </Menu>
    </Bar>
  );
}

const Bar = styled.View({
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

const Brand = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const Logo = styled.Image({
  width: 36,
  height: 36,
});

const BrandText = styled.Text({
  fontSize: 24,
  fontWeight: '500',
  color: '#000000',
});

const Menu = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const MenuItem = styled.Pressable({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const MenuIcon = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 28,
  height: 28,
  gap: 4,
});

const MenuText = styled.Text({
  ...typography.caption3.regular,
  color: colors.gray[500],
});
