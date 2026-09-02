import { IconComponent } from '@components/Icons';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNoticeDetailQuery, useNoticesQuery } from '../../../queries';
import { MyPageSectionLayout } from '../SectionLayout';

const formatPublishedAt = (publishedAt: string) => publishedAt.replaceAll('-', '.');

export function MyPageNoticesScreen() {
  const { data: notices = [], error, isPending, refetch } = useNoticesQuery();
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>();
  const {
    data: selectedNotice,
    error: detailError,
    isPending: isDetailPending,
    refetch: refetchDetail,
  } = useNoticeDetailQuery(selectedNoticeId);

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
              onPress={() => setSelectedNoticeId(notice.id)}
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

      <BottomSheetModal
        accessibilityLabel="공지사항 상세 닫기"
        sheetStyle={detailSheetStyle}
        title="공지사항 상세"
        visible={Boolean(selectedNoticeId)}
        onClose={() => setSelectedNoticeId(undefined)}
      >
        {() => (
          <DetailScroll contentContainerStyle={detailContentStyle}>
            {isDetailPending ? (
              <DetailState accessibilityLiveRegion="polite">
                <ActivityIndicator color={colors.primary[700]} />
                <StateText>공지사항 내용을 불러오고 있어요.</StateText>
              </DetailState>
            ) : detailError || !selectedNotice ? (
              <DetailState>
                <StateText>
                  {detailError instanceof Error
                    ? detailError.message
                    : '공지사항 내용을 불러오지 못했어요.'}
                </StateText>
                <RetryButton accessibilityRole="button" onPress={() => refetchDetail()}>
                  <RetryText>다시 시도</RetryText>
                </RetryButton>
              </DetailState>
            ) : (
              <Detail>
                <DetailCategory>[{selectedNotice.category}]</DetailCategory>
                <DetailTitle>{selectedNotice.title}</DetailTitle>
                <DetailDate>{formatPublishedAt(selectedNotice.publishedAt)}</DetailDate>
                <Divider />
                <Paragraphs>
                  {selectedNotice.content.split(/\n\s*\n/).map((paragraph, index) => (
                    <DetailParagraph key={`${selectedNotice.id}-${index}`}>
                      {paragraph}
                    </DetailParagraph>
                  ))}
                </Paragraphs>
              </Detail>
            )}
          </DetailScroll>
        )}
      </BottomSheetModal>
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

const detailSheetStyle = {
  maxWidth: 480,
  height: '82%',
  minHeight: 560,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;
const DetailScroll = styled.ScrollView({ flex: 1, width: '100%' });
const detailContentStyle = { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 } as const;
const DetailState = styled.View({
  flex: 1,
  minHeight: 320,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
});
const Detail = styled.View({ width: '100%', paddingTop: 20 });
const DetailCategory = styled.Text({
  marginBottom: 8,
  ...typography.body3.medium,
  color: colors.primary[800],
});
const DetailTitle = styled.Text({ ...typography.heading2.semibold, color: colors.gray[1000] });
const DetailDate = styled.Text({
  marginTop: 12,
  ...typography.body3.regular,
  color: colors.gray[500],
});
const Divider = styled.View({
  width: '100%',
  height: 1,
  marginVertical: 24,
  backgroundColor: colors.gray[100],
});
const Paragraphs = styled.View({ gap: 18 });
const DetailParagraph = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
  lineHeight: 24,
});
