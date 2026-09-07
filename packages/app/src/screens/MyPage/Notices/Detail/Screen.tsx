import { Header } from '@components/Header';
import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { ActivityIndicator } from 'react-native';
import { appRoutes, useAppNavigation } from '../../../../navigation';
import { useNoticeDetailQuery } from '../../../../queries';

export function MyPageNoticeDetailScreen({ noticeId }: { noticeId: string }) {
  const { replace } = useAppNavigation();
  const { data: notice, error, isPending, refetch } = useNoticeDetailQuery(noticeId);

  return (
    <Screen>
      <Header title="공지사항" />
      <Content contentContainerStyle={contentStyle}>
        {isPending ? (
          <State accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.primary[700]} />
            <StateText>공지사항 내용을 불러오고 있어요.</StateText>
          </State>
        ) : error || !notice ? (
          <State>
            <StateText>
              {error instanceof Error ? error.message : '공지사항 내용을 불러오지 못했어요.'}
            </StateText>
            <RetryButton accessibilityRole="button" onPress={() => refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </State>
        ) : (
          <Detail>
            <Heading>
              <Title accessibilityRole="header">
                [{notice.category}] {notice.title}
              </Title>
              <Metadata>
                <MetaText>{notice.publishedAt.replaceAll('-', '.')}</MetaText>
                <Dot />
                <MetaText>운영팀</MetaText>
              </Metadata>
            </Heading>
            <Divider />
            <Body>{notice.content}</Body>
          </Detail>
        )}
        <ReturnButton
          accessibilityRole="button"
          onPress={() => replace(appRoutes.myPageSection('notices'))}
        >
          <IconComponent name="carousel_left" size={18} color={colors.gray[300]} />
          <ReturnText>목록으로 돌아가기</ReturnText>
        </ReturnButton>
      </Content>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, backgroundColor: '#FFFFFF' });
const Content = styled.ScrollView({ flex: 1 });
const contentStyle = { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 24, gap: 20 };

const Detail = styled.View({
  flexGrow: 1,
  gap: 20,
});

const Heading = styled.View({
  gap: 12,
});

const Title = styled.Text({
  ...typography.heading4.medium,
  color: colors.gray[1000],
});

const Metadata = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

const MetaText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
});

const Dot = styled.View({
  width: 2,
  height: 2,
  borderRadius: 1,
  backgroundColor: colors.gray[200],
});

const Divider = styled.View({
  height: 1,
  backgroundColor: colors.gray[100],
});

const Body = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[900],
});

const ReturnButton = styled.Pressable({
  minHeight: 44,
  paddingHorizontal: 12,
  paddingVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: colors.gray[50],
  borderRadius: 8,
});

const ReturnText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[800],
});

const State = styled.View({
  flexGrow: 1,
  minHeight: 280,
  alignItems: 'center',
  justifyContent: 'center',
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

const RetryText = styled.Text({
  ...typography.body3.medium,
  color: colors.primary[800],
});
