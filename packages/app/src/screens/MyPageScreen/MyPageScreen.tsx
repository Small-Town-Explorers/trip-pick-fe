import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { appRoutes, useAppNavigation } from '../../navigation';

const menus = [
  ['account', '계정 정보'],
  ['notifications', '알림 설정'],
  ['notices', '공지사항'],
  ['faq', '자주 묻는 질문 (FAQ)'],
  ['terms', '이용 약관'],
  ['privacy', '개인정보 처리방침'],
] as const;

export function MyPageScreen() {
  const { back, navigate } = useAppNavigation();
  return (
    <Screen>
      <Header>
        <Back accessibilityRole="button" onPress={back}>
          <IconComponent name="carousel_left" color={colors.gray[400]} />
        </Back>
        <Title>마이페이지</Title>
        <Spacer />
      </Header>
      <Content>
        <Profile>
          <Avatar>
            <IconComponent name="profile" size={28} color={colors.primary[700]} />
          </Avatar>
          <ProfileText>
            <Name>김민수 님</Name>
            <Email>user@email.com</Email>
          </ProfileText>
        </Profile>
        <Menu>
          {menus.map(([route, label]) => (
            <MenuItem
              key={route}
              accessibilityRole="button"
              onPress={() => navigate(appRoutes.myPageSection(route))}
            >
              <MenuText>{label}</MenuText>
              <IconComponent name="carousel_right" color={colors.gray[300]} />
            </MenuItem>
          ))}
        </Menu>
        <Version>앱 버전 1.2.0</Version>
      </Content>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, backgroundColor: colors.gray[25] });
const Header = styled.View({
  height: 64,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[100],
});
const Back = styled.Pressable({ width: 24, height: 24 });
const Spacer = styled.View({ width: 24 });
const Title = styled.Text({ ...typography.heading4.semibold, color: colors.gray[1000] });
const Content = styled.ScrollView({ flex: 1, padding: 20 });
const Profile = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  padding: 20,
  gap: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});
const Avatar = styled.View({
  width: 52,
  height: 52,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary[50],
  borderRadius: 9999,
});
const ProfileText = styled.View({ gap: 4 });
const Name = styled.Text({ ...typography.body1.semibold, color: colors.gray[1000] });
const Email = styled.Text({ ...typography.caption1.regular, color: colors.gray[500] });
const Menu = styled.View({
  marginTop: 20,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});
const MenuItem = styled.Pressable({
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[50],
});
const MenuText = styled.Text({ ...typography.body2.regular, color: colors.gray[800] });
const Version = styled.Text({
  paddingVertical: 24,
  ...typography.caption2.regular,
  color: colors.gray[400],
  textAlign: 'center',
});
