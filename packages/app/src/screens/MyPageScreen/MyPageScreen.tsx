import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { appRoutes, useAppNavigation } from '../../navigation';
import { Platform } from 'react-native';
import { useState } from 'react';
import { Header } from '@components/Header';

const indicators = [
  { label: '지난 여정', value: 4 },
  { label: '저장한 코스', value: 12 },
  { label: '방문한 지역', value: 3 },
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

const ToggleButton = styled.Pressable<{ isOn: boolean }>(({ isOn }) => ({
  position: 'relative',

  width: 44,
  height: 24,

  borderRadius: 12,
  backgroundColor: isOn ? '#10BC2E' : '#D9D9D9',
  transition: 'background-color 0.1s ease-in-out',
}));

const ToggleCircle = styled.View<{ isOn: boolean }>(({ isOn }) => ({
  position: 'absolute',

  width: 20,
  height: 20,

  top: 2,
  left: isOn ? 22 : 2,
  transition: 'left 0.1s ease-in-out',

  backgroundColor: '#FFFFFF',
  borderRadius: 10,
}));

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

export function MyPageScreen() {
  const { navigate } = useAppNavigation();
  const [notificationStatus, setNotoficationStatus] = useState(false);

  const [profileName, setProfileName] = useState('김민수');
  const [editingName, setEditingName] = useState(profileName);
  const [isNameEdit, setIsNameEdit] = useState(false);

  const handleStartNameEdit = () => {
    setEditingName(profileName);
    setIsNameEdit(true);
  };

  const handleCancelNameEdit = () => {
    setProfileName(editingName);
    setIsNameEdit(false);
  };

  return (
    <Screen>
      <Header title="마이페이지" />
      <Content>
        <Profile>
          <ProfileHeader>
            <ProfileName>
              {!isNameEdit ? (
                <ProfileNameValue>{profileName}</ProfileNameValue>
              ) : (
                <ProfileNameEdit>
                  <ProfileNameEditInput
                    value={editingName}
                    onChangeText={setEditingName}
                    autoFocus
                    returnKeyType="done"
                  />

                  <ProfileNameEditCancelButton onPress={handleCancelNameEdit}>
                    <IconComponent name="cancel" size={24} color={colors.gray[200]} />
                  </ProfileNameEditCancelButton>
                </ProfileNameEdit>
              )}
              <ProfileNameSub>님</ProfileNameSub>
              {!isNameEdit ? (
                <ProfileNameEditButton onPress={handleStartNameEdit}>
                  <IconComponent name="pencil" size={20} color={colors.gray[500]} />
                </ProfileNameEditButton>
              ) : null}
            </ProfileName>
            <ProfileStreakText>
              소도시 발굴을 시작한 지 <ProfileStreakHighlight>20일</ProfileStreakHighlight>째
            </ProfileStreakText>
          </ProfileHeader>
          <ProfileIndicators>
            {indicators.map((item, index) => (
              <ProfileIndicatorItem key={index}>
                <ProfileIndicatorItemLabel>{item.label}</ProfileIndicatorItemLabel>
                <ProfileIndicatorItemValue>{item.value}</ProfileIndicatorItemValue>
              </ProfileIndicatorItem>
            ))}
          </ProfileIndicators>
        </Profile>
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
                        isOn={notificationStatus}
                        onPress={() => setNotoficationStatus((prev) => !prev)}
                        accessibilityRole="switch"
                        accessibilityState={{ checked: notificationStatus }}
                      >
                        <ToggleCircle isOn={notificationStatus} />
                      </ToggleButton>
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

const Screen = styled.View({ flex: 1, backgroundColor: colors.gray[25] });
const Content = styled.ScrollView({ flex: 1 });

const Profile = styled.View({
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 28,
  backgroundColor: '#FFFFFF',
});

const ProfileHeader = styled.View({
  gap: 16,
});

const ProfileName = styled.View({
  flexDirection: 'row',
  gap: 8,
  alignItems: 'center',
});

const ProfileNameValue = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
});

const ProfileNameEdit = styled.View({
  flexDirection: 'row',
  flex: 1,
  backgroundColor: colors.gray[25],
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 10,
  height: 50,
  alignItems: 'center',
});

const ProfileNameEditInput = styled.TextInput({
  flex: 1,
  ...typography.heading3.medium,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});

const ProfileNameEditCancelButton = styled.Pressable({});

const ProfileNameSub = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[700],
});

const ProfileNameEditButton = styled.Pressable({
  width: 32,
  height: 32,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileStreakText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});
const ProfileStreakHighlight = styled.Text({
  ...typography.body2.semibold,
});

const ProfileIndicators = styled.View({
  flexDirection: 'row',
  gap: 16,
});

const ProfileIndicatorItem = styled.View({
  flex: 1,
  padding: 16,
  gap: 4,
  borderRadius: 8,
  backgroundColor: colors.gray[50],
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileIndicatorItemLabel = styled.Text({
  ...typography.caption1.medium,
  color: colors.gray[700],
});
const ProfileIndicatorItemValue = styled.Text({
  ...typography.heading4.semibold,
  color: colors.primary[1000],
});
