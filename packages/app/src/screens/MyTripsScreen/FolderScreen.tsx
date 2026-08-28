import Landscape1 from '@assets/images/mock/landscape/landscape1.png';
import Landscape2 from '@assets/images/mock/landscape/landscape2.png';
import { CourseCreateButton } from '@components/Buttons';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, createShadow, shadows, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { type ImageSourcePropType } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';
import { Header } from '@components/Header';

interface MyTripFolderScreenProps {
  folderId: string;
}
interface CourseItem {
  id: string;
  title: string;
  image: unknown;
  upcoming: boolean;
}

const initialCourses: CourseItem[] = [
  { id: 'gangjin', title: '강진 감성 힐링 투어', image: Landscape1, upcoming: true },
  { id: 'tongyeong', title: '통영 낭만 바다 여행', image: Landscape2, upcoming: false },
  { id: 'damyang', title: '담양 대나무숲 힐링 여행', image: Landscape1, upcoming: false },
  { id: 'gunsan', title: '군산 시간여행 감성 코스', image: Landscape2, upcoming: false },
  { id: 'hadong', title: '하동 녹차밭 여유 여행', image: Landscape1, upcoming: false },
];

export function MyTripFolderScreen({ folderId }: MyTripFolderScreenProps) {
  const { navigate } = useAppNavigation();
  const [courses, setCourses] = useState(initialCourses);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const upcomingCourses = courses.filter((course) => course.upcoming);
  const pastCourses = courses.filter((course) => !course.upcoming);

  const openDeleteModal = (course: CourseItem) => {
    setMenuId(null);
    setDeleteTarget(course);
    setIsDeleteVisible(true);
  };

  const deleteCourse = () => {
    if (deleteTarget) {
      setCourses((current) => current.filter((course) => course.id !== deleteTarget.id));
    }
    setIsDeleteVisible(false);
  };

  const renderCourse = (course: CourseItem) => (
    <Course
      key={course.id}
      active={menuId === course.id}
      accessibilityRole="button"
      onPress={() => {
        if (menuId) return setMenuId(null);
        navigate(appRoutes.courseResult(course.id));
      }}
    >
      <CourseImage source={course.image as ImageSourcePropType} resizeMode="cover" />
      <CourseBody>
        <CourseHeader>
          <CourseTitle numberOfLines={1}>{course.title}</CourseTitle>
          <MenuButton
            accessibilityRole="button"
            accessibilityLabel={`${course.title} 메뉴`}
            onPress={(event) => {
              event.stopPropagation();
              setMenuId((current) => (current === course.id ? null : course.id));
            }}
          >
            <IconComponent name="donut_menu" />
          </MenuButton>
        </CourseHeader>
        <Date>2026.9.5 - 2026.9.6</Date>
        <Chip>7개의 스팟</Chip>
      </CourseBody>
      {menuId === course.id && (
        <DeleteButton
          accessibilityRole="button"
          accessibilityLabel={`${course.title} 삭제`}
          onPress={(event) => {
            event.stopPropagation();
            openDeleteModal(course);
          }}
        >
          <DeleteText>삭제</DeleteText>
          <IconComponent name="delete" color="#F04438" size={20} />
        </DeleteButton>
      )}
    </Course>
  );

  return (
    <Screen testID={`my-trip-folder-${folderId}`}>
      <Header title="폴더명" sub={`(${courses.length})`} />
      <Scroll contentContainerStyle={contentStyle}>
        {upcomingCourses.length > 0 && (
          <Section>
            <SubTitle>다가오는 여행</SubTitle>
            {upcomingCourses.map(renderCourse)}
          </Section>
        )}
        {pastCourses.length > 0 && (
          <Section>
            <SubTitle>지난 여행</SubTitle>
            {pastCourses.map(renderCourse)}
          </Section>
        )}
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
        visible={isDeleteVisible}
        onCancel={() => setIsDeleteVisible(false)}
        onConfirm={deleteCourse}
      >
        <DeleteMessage>
          &apos;{deleteTarget?.title ?? ''}&apos; 코스를{`\n`}삭제하시겠습니까?
        </DeleteMessage>
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
  padding: 16,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
  zIndex: active ? 20 : 0,
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
const MenuButton = styled.Pressable({ padding: 2 });
const Date = styled.Text({ ...typography.body3.medium, color: colors.gray[600] });
const Chip = styled.Text({
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 5,
  ...typography.caption2.medium,
  color: colors.primary[700],
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});
const DeleteButton = styled.Pressable({
  position: 'absolute',
  right: -8,
  top: 54,
  zIndex: 30,
  height: 44,
  paddingHorizontal: 14,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.15)),
});
const DeleteText = styled.Text({ ...typography.body2.medium, color: colors.gray[600] });
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
const DeleteMessage = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
