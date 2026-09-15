import { ContentScroll } from '@components/ContentScroll';
import { Header } from '@components/Header';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { decodeSharedCourse } from '../../sharing';
import { CourseResultMap } from '../CourseResultScreen/Map';
import { CourseResultRoutine } from '../CourseResultScreen/Routine';

type SharedCourseScreenProps = {
  encodedCourse?: string | null;
};

export function SharedCourseScreen({ encodedCourse }: SharedCourseScreenProps) {
  const sharedCourse = decodeSharedCourse(encodedCourse);

  if (!sharedCourse) {
    return (
      <Screen>
        <Header title="공유 받은 코스" />
        <ErrorState>
          <ErrorTitle>코스 링크를 열 수 없어요.</ErrorTitle>
          <ErrorDescription>
            링크가 손상되었거나 지원하지 않는 형식이에요. 공유한 사람에게 새 링크를 요청해 주세요.
          </ErrorDescription>
        </ErrorState>
      </Screen>
    );
  }

  return (
    <Screen>
      <ContentScroll paddingBottom={40}>
        <Header title="공유 받은 코스" />
        <CourseResultMap places={sharedCourse.places} />
        <CourseResultRoutine
          readOnly
          title={sharedCourse.title}
          period={sharedCourse.period}
          places={sharedCourse.places}
        />
      </ContentScroll>
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  width: '100%',
  minHeight: '100%',
  backgroundColor: '#FFFFFF',
});

const ErrorState = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 32,
  gap: 12,
});

const ErrorTitle = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[900],
  textAlign: 'center',
});

const ErrorDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
