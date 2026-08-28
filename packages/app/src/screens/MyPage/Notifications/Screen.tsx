import { ToggleButton } from '@components/Buttons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { Platform } from 'react-native';
import { MyPageSectionLayout } from '../SectionLayout';

export function MyPageNotificationsScreen() {
  const [allNotifications, setAllNotifications] = useState(true);
  const [courseRecommendations, setCourseRecommendations] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <MyPageSectionLayout title="알림 설정">
      <NotificationContent>
        <Guide>앱에서 수신할 알림 종류를 선택할 수 있습니다.</Guide>
        <CardList>
          <Card>
            <SettingContent>
              <SettingTitle>알림 설정</SettingTitle>
              <SettingDescription>모든 푸시 알림</SettingDescription>
            </SettingContent>
            <ToggleButton
              value={allNotifications}
              onToggle={() => setAllNotifications((value) => !value)}
            />
          </Card>

          <Card>
            <SettingContent>
              <SettingTitle>여행 코스 추천 알림</SettingTitle>
              <SettingDescription>취향에 맞는 소도시 여행 코스를 추천</SettingDescription>
            </SettingContent>
            <ToggleButton
              value={courseRecommendations}
              onToggle={() => setCourseRecommendations((value) => !value)}
            />
          </Card>

          <Card last>
            <SettingContent>
              <SettingTitle>마케팅 정보 수신</SettingTitle>
              <SettingDescription>이벤트 및 혜택 정보</SettingDescription>
            </SettingContent>
            <ToggleButton value={marketing} onToggle={() => setMarketing((value) => !value)} />
          </Card>
        </CardList>
      </NotificationContent>
    </MyPageSectionLayout>
  );
}

const NotificationContent = styled.View({
  width: '100%',
  paddingTop: 28,
  paddingHorizontal: 20,
  paddingBottom: 12,
  gap: 16,
});

const Guide = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[600],
});

const CardList = styled.View({
  width: '100%',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...Platform.select({
    web: { boxShadow: '0 0 20px rgba(8,25,29,0.05)' },
    android: { elevation: 3 },
  }),
});

const Card = styled.View<{ last?: boolean }>(({ last }) => ({
  width: '100%',
  height: 90,
  padding: 20,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  borderBottomWidth: last ? 0 : 1,
  borderBottomColor: colors.gray[50],
}));

const SettingContent = styled.View({
  flex: 1,
  gap: 8,
});

const SettingTitle = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const SettingDescription = styled.Text({
  ...typography.body3.medium,
  color: colors.gray[600],
});
