import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Header } from '@components/Header';
import { MyPageGuestProfile, MyPageProfile } from './Profile';
import { MyPageMenus } from './Menus';
import { localDataStorage } from '../../storage';
import { appRoutes, useAppNavigation } from '../../navigation';
import { hasApiAccessToken } from '../../controllers';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const ACCESS_TOKEN_KEY = 'trip-pick.access-token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'trip-pick.access-token-expires-at';

const clearAccessToken = async () => {
  await localDataStorage.removeItem(ACCESS_TOKEN_KEY);
  await localDataStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
};

export function MyPageScreen() {
  const { navigate, replace } = useAppNavigation();
  const queryClient = useQueryClient();
  const [logoutError, setLogoutError] = useState('');
  const isAuthenticated = hasApiAccessToken();
  const handleLogout = async () => {
    try {
      await clearAccessToken();
      queryClient.clear();
      replace('/');
    } catch {
      setLogoutError('로그아웃 정보를 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <Screen>
      <Header title="마이페이지" />
      <Content>
        {isAuthenticated ? (
          <MyPageProfile />
        ) : (
          <MyPageGuestProfile onLogin={() => navigate(appRoutes.login)} />
        )}
        <MyPageMenus isAuthenticated={isAuthenticated} />
        {isAuthenticated ? (
          <Logout>
            <LogoutButton onPress={handleLogout}>
              <LogoutButtonText>로그아웃</LogoutButtonText>
            </LogoutButton>
            {logoutError ? (
              <LogoutButtonText accessibilityLiveRegion="polite">{logoutError}</LogoutButtonText>
            ) : null}
          </Logout>
        ) : null}
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
