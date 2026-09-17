import { ContentScroll } from '@components/ContentScroll';
import { Header } from '@components/Header';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { ActivityIndicator } from 'react-native';
import { ApiError } from '../../controllers';
import { useSharedCourseQuery } from '../../queries';
import { decodeSharedCourse } from '../../sharing';
import { CourseResultMap } from '../CourseResultScreen/Map';
import { CourseResultRoutine, createCoursePlacesFromResponse } from '../CourseResultScreen/Routine';

type SharedCourseScreenProps = {
  shareId?: string | null;
  encodedCourse?: string | null;
};

export function SharedCourseScreen({ shareId, encodedCourse }: SharedCourseScreenProps) {
  const sharedCourseQuery = useSharedCourseQuery(shareId ?? undefined);
  const legacySharedCourse = shareId ? null : decodeSharedCourse(encodedCourse);

  if (shareId && sharedCourseQuery.isPending) {
    return (
      <Screen>
        <Header title="공유 받은 코스" />
        <LoadingState>
          <ActivityIndicator color={colors.primary[700]} />
          <ErrorDescription>공유 코스를 불러오고 있어요.</ErrorDescription>
        </LoadingState>
      </Screen>
    );
  }

  const sharedCourse = sharedCourseQuery.data
    ? {
        title: sharedCourseQuery.data.title,
        period: {
          startDate: sharedCourseQuery.data.course.startDate ?? undefined,
          endDate: sharedCourseQuery.data.course.endDate ?? undefined,
        },
        places: createCoursePlacesFromResponse(sharedCourseQuery.data.course),
      }
    : legacySharedCourse;

  if (!sharedCourse) {
    const errorMessage =
      sharedCourseQuery.error instanceof ApiError
        ? sharedCourseQuery.error.message
        : '링크가 손상되었거나 지원하지 않는 형식이에요. 공유한 사람에게 새 링크를 요청해 주세요.';

    return (
      <Screen>
        <Header title="공유 받은 코스" />
        <ErrorState>
          <ErrorTitle>코스 링크를 열 수 없어요.</ErrorTitle>
          <ErrorDescription>{errorMessage}</ErrorDescription>
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
const LoadingState = styled(ErrorState)({});

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
