import { IconComponent } from '@components/Icons';
import { colors, typography, withAlpha } from '@styles';
import { MyPageSectionLayout } from '../SectionLayout';
import styled from '@emotion/native';
const notices = [
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
  { type: '안내', title: '개인정보 처리방침 변경 사전 안내', date: '2025.09.01', id: 1 },
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
  {
    type: '이벤트',
    title: '소도시 발굴단 리뷰 작성 이벤트 당첨자 발표',
    date: '2025.09.01',
    id: 1,
  },
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
  { type: '공지', title: '가을 여행 테마 업데이트 안내', date: '2025.09.01', id: 1 },
];
export function MyPageNoticesScreen() {
  return (
    <MyPageSectionLayout title="공지사항">
      {notices.map((notice, i) => (
        <Notice key={i}>
          <NoticeDate>{notice.date}</NoticeDate>
          <NoticeRow>
            <NoticeTitle>
              [{notice.type}] {notice.title}
            </NoticeTitle>
            <IconComponent name="carousel_right" size={14} color={colors.gray[500]} />
          </NoticeRow>
        </Notice>
      ))}
    </MyPageSectionLayout>
  );
}

const Notice = styled.Pressable({
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 12,
  borderBottomColor: withAlpha(colors.gray[1000], 0.1),
  borderBottomWidth: 1,
});

const NoticeDate = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
});

const NoticeRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const NoticeTitle = styled.Text({
  ...typography.body1.medium,
  color: colors.gray[1000],
});
