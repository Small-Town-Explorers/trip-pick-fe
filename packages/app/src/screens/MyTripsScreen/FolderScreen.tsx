import Landscape1 from '@assets/images/mock/landscape/landscape1.png';
import Landscape2 from '@assets/images/mock/landscape/landscape2.png';
import { CourseCreateButton } from '@components/Buttons';
import { DeleteActionButton } from '@components/DeleteActionButton';
import { Header } from '@components/Header';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, shadows, typography } from '@styles';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, type ImageSourcePropType } from 'react-native';
import { ApiError, getMyCourseDetail, type MyCourseSummary } from '../../controllers';
import { appRoutes, useAppNavigation } from '../../navigation';
import {
  myCourseDetailQueryKey,
  useDeleteMyCourseMutation,
  useFoldersQuery,
  useMyCoursesQuery,
} from '../../queries';

interface MyTripFolderScreenProps {
  folderId: string;
}

const courseImages = [Landscape1, Landscape2] as ImageSourcePropType[];

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (date: string) => date.split('-').map(Number).join('.');

const formatPeriod = ({ startDate, endDate }: MyCourseSummary) => {
  if (!startDate) return '날짜 미정';
  if (!endDate || startDate === endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const getCourseImage = (courseId: string) => {
  const imageIndex = [...courseId].reduce((total, character) => total + character.charCodeAt(0), 0);
  return courseImages[imageIndex % courseImages.length];
};

export function MyTripFolderScreen({ folderId }: MyTripFolderScreenProps) {
  const { navigate } = useAppNavigation();
  const queryClient = useQueryClient();
  const { data: folders = [] } = useFoldersQuery();
  const { data: courses = [], error, isPending, refetch } = useMyCoursesQuery(folderId);
  const deleteCourseMutation = useDeleteMyCourseMutation();
  const [openingCourseId, setOpeningCourseId] = useState<string>();
  const [openedMenuId, setOpenedMenuId] = useState<string>();
  const [deleteTarget, setDeleteTarget] = useState<MyCourseSummary>();
  const [openError, setOpenError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const folder = folders.find(({ id }) => id === folderId);
  const today = getToday();
  const upcomingCourses = courses.filter((course) => !course.endDate || course.endDate >= today);
  const pastCourses = courses.filter((course) => course.endDate && course.endDate < today);

  const openCourse = async (course: MyCourseSummary) => {
    if (openingCourseId) return;

    setOpenError('');
    setOpeningCourseId(course.id);
    try {
      await queryClient.fetchQuery({
        queryKey: myCourseDetailQueryKey(course.id),
        queryFn: () => getMyCourseDetail(course.id),
      });
      navigate(appRoutes.tripDetail(course.id));
    } catch (detailError) {
      setOpenError(
        detailError instanceof ApiError
          ? detailError.message
          : '코스 상세를 불러오지 못했어요. 다시 시도해 주세요.',
      );
    } finally {
      setOpeningCourseId(undefined);
    }
  };

  const deleteCourse = async () => {
    if (!deleteTarget || deleteCourseMutation.isPending) return;

    setDeleteError('');
    try {
      await deleteCourseMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(undefined);
    } catch (mutationError) {
      setDeleteError(
        mutationError instanceof ApiError
          ? mutationError.message
          : '여행 코스를 삭제하지 못했어요. 다시 시도해 주세요.',
      );
    }
  };

  const renderCourse = (course: MyCourseSummary) => (
    <Course
      key={course.id}
      active={openedMenuId === course.id}
      accessibilityRole="button"
      disabled={Boolean(openingCourseId)}
      onPress={() => {
        if (openedMenuId) {
          setOpenedMenuId(undefined);
          return;
        }
        void openCourse(course);
      }}
    >
      <CourseImage source={getCourseImage(course.id)} resizeMode="cover" />
      <CourseBody>
        <CourseHeader>
          <CourseTitle numberOfLines={1}>{course.title}</CourseTitle>
          {openingCourseId === course.id ? (
            <ActivityIndicator size="small" color={colors.primary[700]} />
          ) : (
            <CourseMenuButton
              accessibilityRole="button"
              accessibilityLabel={`${course.title} 메뉴`}
              onPress={(event) => {
                event.stopPropagation();
                setOpenedMenuId((current) => (current === course.id ? undefined : course.id));
              }}
            >
              <IconComponent name="donut_menu" color={colors.gray[600]} />
            </CourseMenuButton>
          )}
        </CourseHeader>
        <DateText>{formatPeriod(course)}</DateText>
        <Chip>{course.itemCount}개의 스팟</Chip>
      </CourseBody>
      {openedMenuId === course.id ? (
        <CourseDeleteMenu>
          <DeleteActionButton
            accessibilityLabel={`${course.title} 삭제`}
            disabled={deleteCourseMutation.isPending}
            onPress={(event) => {
              event.stopPropagation();
              setOpenedMenuId(undefined);
              setDeleteError('');
              setDeleteTarget(course);
            }}
          />
        </CourseDeleteMenu>
      ) : null}
    </Course>
  );

  return (
    <Screen testID={`my-trip-folder-${folderId}`}>
      <Header title={folder?.name ?? '보관함'} sub={`(${folder?.courseCount ?? 0})`} />
      <Scroll contentContainerStyle={contentStyle}>
        {isPending ? (
          <Status>
            <ActivityIndicator color={colors.primary[700]} />
            <StatusText>저장한 코스를 불러오고 있어요.</StatusText>
          </Status>
        ) : null}
        {error ? (
          <Status>
            <StatusText>
              {error instanceof ApiError ? error.message : '저장한 코스를 불러오지 못했어요.'}
            </StatusText>
            <RetryButton accessibilityRole="button" onPress={() => void refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </Status>
        ) : null}
        {openError ? <OpenError>{openError}</OpenError> : null}
        {!isPending && !error && courses.length === 0 ? (
          <Status>
            <StatusText>이 보관함에 저장한 코스가 없어요.</StatusText>
          </Status>
        ) : null}
        {upcomingCourses.length > 0 ? (
          <Section>
            <SubTitle>다가오는 여행</SubTitle>
            {upcomingCourses.map(renderCourse)}
          </Section>
        ) : null}
        {pastCourses.length > 0 ? (
          <Section>
            <SubTitle>지난 여행</SubTitle>
            {pastCourses.map(renderCourse)}
          </Section>
        ) : null}
      </Scroll>
      <Action>
        <CourseCreateButton icon="plus" onPress={() => navigate(appRoutes.courseCreate)}>
          AI로 새 여행 코스 만들기
        </CourseCreateButton>
      </Action>
      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        title="여행 코스 삭제"
        visible={Boolean(deleteTarget)}
        onCancel={() => {
          setDeleteTarget(undefined);
          setDeleteError('');
        }}
        onConfirm={deleteCourse}
      >
        <DeleteDescription>
          &apos;{deleteTarget?.title ?? ''}&apos; 코스를{`\n`}삭제하시겠습니까?
        </DeleteDescription>
        {deleteError ? <DeleteError>{deleteError}</DeleteError> : null}
      </ConfirmModal>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const Scroll = styled.ScrollView({ flex: 1 });
const contentStyle = { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 128 } as const;
const Section = styled.View({ width: '100%', marginBottom: 40, gap: 24 });
const SubTitle = styled.Text({ ...typography.heading3.semibold, color: colors.gray[1000] });
const Course = styled.Pressable<{ active: boolean }>(({ active }) => ({
  width: '100%',
  minHeight: 119,
  zIndex: active ? 20 : 0,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...shadows[2],
}));
const CourseImage = styled.Image({ width: 87, height: 87, borderRadius: 8 });
const CourseBody = styled.View({ flex: 1, height: 87, gap: 8 });
const CourseHeader = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});
const CourseTitle = styled.Text({
  flex: 1,
  ...typography.body2.semibold,
  color: colors.gray[1000],
});
const CourseMenuButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});
const CourseDeleteMenu = styled.View({
  position: 'absolute',
  top: 58,
  right: -10,
  zIndex: 30,
});
const DateText = styled.Text({ ...typography.body3.medium, color: colors.gray[600] });
const Chip = styled.Text({
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 5,
  ...typography.caption2.medium,
  color: colors.primary[700],
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});
const Action = styled.View({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  paddingHorizontal: 20,
  paddingVertical: 24,
  backgroundColor: '#FFFFFF',
  zIndex: 40,
});
const Status = styled.View({
  width: '100%',
  minHeight: 160,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
});
const StatusText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const RetryButton = styled.Pressable({
  paddingHorizontal: 16,
  paddingVertical: 9,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.body2.medium, color: colors.primary[700] });
const OpenError = styled.Text({
  width: '100%',
  marginBottom: 16,
  padding: 12,
  borderRadius: 8,
  ...typography.body3.regular,
  color: colors.semantic.warning,
  backgroundColor: colors.semantic.warningDisabled,
  textAlign: 'center',
});
const DeleteDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const DeleteError = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
