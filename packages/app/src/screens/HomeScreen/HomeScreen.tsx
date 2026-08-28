import styled from '@emotion/native';
import { HomeHeader } from './Header';
import { HomeRecommendations } from './Recommendations';
import { HomeUpcomingTrip } from './UpcomingTrip';
import { CourseCreateButton } from '@components/Buttons';
import { Platform } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';
import {
  subscribeCourseSaveNotice,
  takeCourseSaveNotice,
  type CourseSaveNotice,
} from '../../storage/courseSaveNotice';
import { useEffect, useState } from 'react';
import { HomeSaveCompleteModal } from './SaveCompleteModal';

export function HomeScreen() {
  const { navigate } = useAppNavigation();
  const [saveNotice, setSaveNotice] = useState<CourseSaveNotice | null>(null);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  useEffect(() => {
    const showSaveNotice = () => {
      const notice = takeCourseSaveNotice();
      if (notice) {
        setSaveNotice(notice);
        setIsSaveModalVisible(true);
      }
    };

    showSaveNotice();
    return subscribeCourseSaveNotice(showSaveNotice);
  }, []);

  return (
    <Screen>
      <Scroll contentContainerStyle={scrollContentStyle}>
        <HomeHeader />
        <HomeRecommendations />
        <HomeUpcomingTrip />
      </Scroll>
      <Action>
        <CourseCreateButton onPress={() => navigate(appRoutes.courseCreate)}>
          AI로 여행 코스 만들기
        </CourseCreateButton>
      </Action>
      <HomeSaveCompleteModal
        title={saveNotice?.title ?? ''}
        visible={isSaveModalVisible}
        onClose={() => setIsSaveModalVisible(false)}
        onView={() => {
          setIsSaveModalVisible(false);
          navigate(appRoutes.myTrips);
        }}
      />
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
});

const Scroll = styled.ScrollView({
  flex: 1,
  width: '100%',
});

const scrollContentStyle = {
  paddingBottom: 112,
} as const;

const Action = styled.View({
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  backgroundColor: '#FFFFFF',

  ...Platform.select({
    web: {
      position: 'fixed' as never,
      left: '50%',
      maxWidth: 480,
      transform: 'translateX(-50%)',
      zIndex: 100,
    },
    default: {
      position: 'absolute',
      zIndex: 100,
    },
  }),
});
