import { IconComponent } from '@components/Icons';
import { appRoutes, useAppNavigation } from '../../../navigation';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { ActivityIndicator } from 'react-native';
import { useNoticesQuery } from '../../../queries';
import { MyPageSectionLayout } from '../SectionLayout';

const formatPublishedAt = (publishedAt: string) => publishedAt.replaceAll('-', '.');

export function MyPageNoticesScreen() {
  const { data: notices = [], error, isPending, refetch } = useNoticesQuery();
  const { navigate } = useAppNavigation();

  return (
    <>
      <MyPageSectionLayout title="공지사항">
        {isPending ? (
          <State accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.primary[700]} />
            <StateText>공지사항을 불러오고 있어요.</StateText>
          </State>
        ) : error ? (
          <State>
            <StateText>
              {error instanceof Error ? error.message : '공지사항을 불러오지 못했어요.'}
            </StateText>
            <RetryButton accessibilityRole="button" onPress={() => refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </State>
        ) : notices.length === 0 ? (
          <State>
            <StateText>등록된 공지사항이 없어요.</StateText>
          </State>
        ) : (
          notices.map((notice) => (
            <Notice
              key={notice.id}
              accessibilityRole="button"
              accessibilityLabel={`${notice.category} ${notice.title}`}
              onPress={() => navigate(appRoutes.myPageNoticeDetail(notice.id))}
            >
              <NoticeDate>{formatPublishedAt(notice.publishedAt)}</NoticeDate>
              <NoticeRow>
                <NoticeTitle>
                  [{notice.category}] {notice.title}
                </NoticeTitle>
                <IconComponent name="carousel_right" size={14} color={colors.gray[500]} />
              </NoticeRow>
            </Notice>
          ))
        )}
      </MyPageSectionLayout>
    </>
  );
}

const Notice = styled.Pressable({
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 12,
  borderBottomColor: withAlpha(colors.gray[1000], 0.1),
  borderBottomWidth: 1,
});
const NoticeDate = styled.Text({ ...typography.body3.regular, color: colors.gray[500] });
const NoticeRow = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 12 });
const NoticeTitle = styled.Text({
  flex: 1,
  ...typography.body1.medium,
  color: colors.gray[1000],
});

const State = styled.View({
  minHeight: 280,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  gap: 12,
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
