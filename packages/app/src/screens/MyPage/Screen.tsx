import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { appRoutes, useAppNavigation } from '../../navigation';
import { Platform } from 'react-native';
import { useState } from 'react';
import { Header } from '@components/Header';
import { MyPageProfile } from './Profile';
import { ToggleButton } from '@components/Buttons';

const menus: {
  type: string;
  items: {
    label: string;
    route?: 'account' | 'notifications' | 'notices' | 'faq' | 'terms' | 'privacy' | 'location';
  }[];
}[] = [
  {
    type: '계정 관리',
    items: [
      { label: '계정 정보', route: 'account' },
      { label: '알림 설정', route: 'notifications' },
      { label: '위치 권한', route: 'location' },
      { label: '앱 버전' },
    ],
  },
  {
    type: '지원',
    items: [
      { label: '공지사항', route: 'notices' },
      { label: '자주 묻는 질문 (FAQ)', route: 'faq' },
      { label: '이용 약관', route: 'terms' },
      { label: '개인정보 처리방침', route: 'privacy' },
    ],
  },
];

const Menu = styled.View({
  paddingTop: 28,
  paddingHorizontal: 20,
  paddingBottom: 12,
  gap: 16,
});

const MenuLabel = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[600],
});

const MenuInner = styled.View({
  borderRadius: 12,
  gap: 1,
  overflow: 'hidden',

  ...Platform.select({
    web: { boxShadow: '0 0 20px rgba(8,25,29,0.05)' },
  }),
});

const MenuItem = styled.Pressable({
  flexDirection: 'row',
  backgroundColor: 'white',
  padding: 20,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const MenuItemLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const MenuItemRight = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const MenuItemAccountSub = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[600],
});

const MenuItemVersionSub = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});

export function MyPageScreen() {
  const { navigate } = useAppNavigation();
  const [notificationStatus, setNotoficationStatus] = useState(false);

  return (
    <Screen>
      <Header title="마이페이지" />
      <Content>
        <MyPageProfile />
        {menus.map((menu, menuIdx) => (
          <Menu key={menuIdx}>
            <MenuLabel>{menu.type}</MenuLabel>
            <MenuInner>
              {menu.items.map((item, itemIdx) => (
                <MenuItem
                  key={`${menuIdx} ${itemIdx}`}
                  onPress={() => {
                    if (item.route === undefined) return;
                    navigate(appRoutes.myPageSection(item.route));
                  }}
                >
                  <MenuItemLabel>{item.label}</MenuItemLabel>
                  <MenuItemRight>
                    {item.route === 'account' ? (
                      <MenuItemAccountSub>카카오 로그인됨</MenuItemAccountSub>
                    ) : item.route === 'notifications' ? (
                      <ToggleButton
                        value={notificationStatus}
                        onToggle={() => {
                          setNotoficationStatus((prev) => !prev);
                        }}
                      />
                    ) : null}
                    {item.route ? (
                      <IconComponent name="carousel_right" size={14} color={colors.gray[500]} />
                    ) : (
                      <MenuItemVersionSub>1.2.0</MenuItemVersionSub>
                    )}
                  </MenuItemRight>
                </MenuItem>
              ))}
            </MenuInner>
          </Menu>
        ))}
        <Logout>
          <LogoutButton>
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
