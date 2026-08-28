import styled from '@emotion/native';
import { colors, typography } from '@styles';

type Props = {
  title: string;
  courseId?: string;
};

export function CourseScreenPlaceholder({ title, courseId }: Props) {
  return (
    <Screen>
      <Badge>COURSE</Badge>
      <Title>{title}</Title>
      <Description>코스 화면 구현을 시작할 수 있는 임시 페이지입니다.</Description>
      {courseId && <CourseId>코스 ID: {courseId}</CourseId>}
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  minHeight: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  backgroundColor: '#FFFFFF',
});

const Badge = styled.Text({
  marginBottom: 16,
  paddingHorizontal: 12,
  paddingVertical: 6,
  ...typography.caption1.medium,
  color: colors.primary[900],
  backgroundColor: colors.primary[50],
  borderRadius: 9999,
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
  textAlign: 'center',
});

const Description = styled.Text({
  marginTop: 10,
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const CourseId = styled.Text({
  marginTop: 24,
  ...typography.body2.medium,
  color: colors.primary[900],
});
