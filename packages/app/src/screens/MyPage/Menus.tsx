import { ToggleButton } from '@components/Buttons';
import { IconComponent } from '@components/Icons';
import { appRoutes, type MyPageSectionRoute, useAppNavigation } from '../../navigation';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { useAccountInfoQuery } from '../../queries';
import { useState } from 'react';
import {
  getLocationPreferenceSnapshot,
  saveLocationPreference,
} from '../../storage/myPagePreferences';
import { useNotificationPreferences } from './useNotificationPreferences';

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

export const MyPageMenus = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { navigate } = useAppNavigation();
  const { data: account } = useAccountInfoQuery(isAuthenticated);
  const notifications = useNotificationPreferences(isAuthenticated);
  const providerLabel = !isAuthenticated
    ? '비회원 이용 중'
    : account?.provider === 'KAKAO'
      ? '카카오 로그인됨'
      : '로그인 정보 확인 중';
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<boolean>(() =>
    getLocationPreferenceSnapshot(!isAuthenticated),
  );
  const [storageError, setStorageError] = useState('');

  const toggleLocationPreference = async () => {
    const next = !locationPermissionStatus;
    try {
      await saveLocationPreference(next);
      setLocationPermissionStatus(next);
      setStorageError('');
    } catch {
      setStorageError('위치 설정을 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return menus.map((menu, menuIdx) => (
    <Menu key={menuIdx}>
      <MenuLabel>{menu.type}</MenuLabel>
      <MenuInner>
        {menu.items.map((item, itemIdx) => (
          <MenuItem
            key={`${menuIdx} ${itemIdx}`}
            onPress={() => {
              if (item.route === undefined || (!isAuthenticated && item.route === 'account')) {
                return;
              }
              navigate(appRoutes.myPageSection(item.route));
            }}
            disabled={item.route === undefined || (!isAuthenticated && item.route === 'account')}
          >
            <MenuItemLabel>{item.label}</MenuItemLabel>
            <MenuItemRight>
              {item.route === 'account' ? (
                <MenuItemAccountSub isGuest={!isAuthenticated}>{providerLabel}</MenuItemAccountSub>
              ) : item.route === 'notifications' ? (
                <ToggleButton
                  value={notifications.settings?.pushEnabled ?? false}
                  onToggle={() => {
                    if (!notifications.settings || notifications.isUpdating) return;
                    void notifications.update({
                      pushEnabled: !notifications.settings.pushEnabled,
                    });
                  }}
                />
              ) : null}
              {item.route && (isAuthenticated || item.route !== 'account') ? (
                <IconComponent name="carousel_right" size={14} color={colors.gray[500]} />
              ) : item.label === '앱 버전' ? (
                <MenuItemVersionSub>1.2.0</MenuItemVersionSub>
              ) : item.label === '위치 권한' ? (
                <ToggleButton
                  value={locationPermissionStatus}
                  onToggle={() => void toggleLocationPreference()}
                />
              ) : null}
            </MenuItemRight>
          </MenuItem>
        ))}
      </MenuInner>
      {menuIdx === 0 && (storageError || notifications.mutationError) ? (
        <MenuItemLabel accessibilityLiveRegion="polite">
          {storageError ||
            (notifications.mutationError instanceof Error
              ? notifications.mutationError.message
              : '알림 설정을 변경하지 못했어요.')}
        </MenuItemLabel>
      ) : null}
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

const MenuItemAccountSub = styled.Text<{ isGuest: boolean }>(({ isGuest }) => ({
  ...typography.body3.medium,
  color: isGuest ? colors.gray[200] : colors.gray[600],
}));

const MenuItemVersionSub = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});
