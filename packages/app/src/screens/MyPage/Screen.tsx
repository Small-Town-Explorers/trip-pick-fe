import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Header } from '@components/Header';
import { MyPageProfile } from './Profile';
import { MyPageMenus } from './Menus';

const ACCESS_TOKEN_KEY = 'trip-pick.access-token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'trip-pick.access-token-expires-at';

const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
};

export function MyPageScreen() {
  const handleLogout = () => {
    clearAccessToken();
    window.location.href = '/';
  };

  return (
    <Screen>
      <Header title="마이페이지" />
      <Content>
        <MyPageProfile />
        <MyPageMenus />
        <Logout>
          <LogoutButton onPress={handleLogout}>
            <LogoutButtonText>로그아웃</LogoutButtonText>
          </LogoutButton>
        </Logout>
      </Content>
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  backgroundColor: colors.gray[25],
});

const Content = styled.ScrollView({
  flex: 1,
});

const Logout = styled.View({
  paddingTop: 36,
  paddingBottom: 48,
  alignItems: 'center',
});

const LogoutButton = styled.Pressable({});

const LogoutButtonText = styled.Text({
  textDecorationLine: 'underline',
  ...typography.body2.regular,
  color: colors.gray[500],
});
