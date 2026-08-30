import { ToggleButton } from '@components/Buttons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { ActivityIndicator } from 'react-native';
import { MyPageSectionLayout } from '../SectionLayout';
import type { NotificationSettings } from '../../../controllers';
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '../../../queries';

export function MyPageNotificationsScreen() {
  const { data: settings, error, isPending, refetch } = useNotificationSettingsQuery();
  const updateNotifications = useUpdateNotificationSettingsMutation();

  const toggle = (field: keyof NotificationSettings) => {
    if (!settings || updateNotifications.isPending) return;
    updateNotifications.mutate({ [field]: !settings[field] });
  };

  return (
    <MyPageSectionLayout title="알림 설정">
      <NotificationContent>
        <Guide>앱에서 수신할 알림 종류를 선택할 수 있습니다.</Guide>
        {isPending ? (
          <StateCard accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.primary[700]} />
            <StateText>알림 설정을 불러오고 있어요.</StateText>
          </StateCard>
        ) : error || !settings ? (
          <StateCard>
            <StateText>
              {error instanceof Error ? error.message : '알림 설정을 불러오지 못했어요.'}
            </StateText>
            <RetryButton accessibilityRole="button" onPress={() => refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </StateCard>
        ) : (
          <CardList>
            <Card>
              <SettingContent>
                <SettingTitle>알림 설정</SettingTitle>
                <SettingDescription>모든 푸시 알림</SettingDescription>
              </SettingContent>
              <ToggleButton value={settings.pushEnabled} onToggle={() => toggle('pushEnabled')} />
            </Card>

            <Card>
              <SettingContent>
                <SettingTitle>여행 코스 추천 알림</SettingTitle>
                <SettingDescription>취향에 맞는 소도시 여행 코스를 추천</SettingDescription>
              </SettingContent>
              <ToggleButton
                value={settings.courseRecommendEnabled}
                onToggle={() => toggle('courseRecommendEnabled')}
              />
            </Card>

            <Card last>
              <SettingContent>
                <SettingTitle>마케팅 정보 수신</SettingTitle>
                <SettingDescription>이벤트 및 혜택 정보</SettingDescription>
              </SettingContent>
              <ToggleButton
                value={settings.marketingEnabled}
                onToggle={() => toggle('marketingEnabled')}
              />
            </Card>
          </CardList>
        )}
        {updateNotifications.error ? (
          <MutationError>
            {updateNotifications.error instanceof Error
              ? updateNotifications.error.message
              : '알림 설정을 변경하지 못했어요.'}
          </MutationError>
        ) : null}
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
  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.05)),
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

const StateCard = styled.View({
  minHeight: 140,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});
const StateText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });
const MutationError = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
