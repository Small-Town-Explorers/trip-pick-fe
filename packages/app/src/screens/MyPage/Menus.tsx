import { ToggleButton } from '@components/Buttons';
import { IconComponent } from '@components/Icons';
import { appRoutes, type MyPageSectionRoute, useAppNavigation } from '../../navigation';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import {
  useAccountInfoQuery,
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '../../queries';
import { useState } from 'react';

const menus: {
  type: string;
  items: {
    label: string;
    route?: MyPageSectionRoute;
  }[];
}[] = [
  {
    type: '계정 관리',
    items: [
      { label: '계정 정보', route: 'account' },
      { label: '알림 설정', route: 'notifications' },
      { label: '위치 권한' },
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

export const MyPageMenus = () => {
  const { navigate } = useAppNavigation();
  const { data: account } = useAccountInfoQuery();
  const { data: notificationSettings } = useNotificationSettingsQuery();
  const updateNotifications = useUpdateNotificationSettingsMutation();
  const providerLabel = account?.provider === 'KAKAO' ? '카카오 로그인됨' : '로그인 정보 확인 중';
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<boolean>(
    Boolean(localStorage.getItem('locationPermissionStatus')),
  );

  return menus.map((menu, menuIdx) => (
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
            disabled={item.route === undefined}
          >
            <MenuItemLabel>{item.label}</MenuItemLabel>
            <MenuItemRight>
              {item.route === 'account' ? (
                <MenuItemAccountSub>{providerLabel}</MenuItemAccountSub>
              ) : item.route === 'notifications' ? (
                <ToggleButton
                  value={notificationSettings?.pushEnabled ?? false}
                  onToggle={() => {
                    if (!notificationSettings || updateNotifications.isPending) return;
                    updateNotifications.mutate({
                      pushEnabled: !notificationSettings.pushEnabled,
                    });
                  }}
                />
              ) : null}
              {item.route ? (
                <IconComponent name="carousel_right" size={14} color={colors.gray[500]} />
              ) : item.label === '앱 버전' ? (
                <MenuItemVersionSub>1.2.0</MenuItemVersionSub>
              ) : (
                <ToggleButton
                  value={locationPermissionStatus}
                  onToggle={() =>
                    setLocationPermissionStatus((prev) => {
                      const newStatus = !prev;
                      localStorage.setItem('locationPermissionStatus', String(newStatus));
                      return newStatus;
                    })
                  }
                />
              )}
            </MenuItemRight>
          </MenuItem>
        ))}
      </MenuInner>
    </Menu>
  ));
};

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

  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.05)),
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
