import type { MyPageSection } from '../../navigation';
import { MyPageAccountScreen } from './Account/Screen';
import { MyPageFaqScreen } from './Faq/Screen';
import { MyPageLocationScreen } from './Location/Screen';
import { MyPageNoticesScreen } from './Notices/Screen';
import { MyPageNotificationsScreen } from './Notifications/Screen';
import { MyPagePrivacyScreen } from './Privacy/Screen';
import { MyPageTermsScreen } from './Terms/Screen';
import { MyPagePastTripsScreen } from './Trips/PastTripsScreen';
import { MyPageSavedCoursesScreen } from './Trips/SavedCoursesScreen';
import { MyPageVisitedRegionsScreen } from './Trips/VisitedRegionsScreen';

const sections = {
  account: MyPageAccountScreen,
  notifications: MyPageNotificationsScreen,
  location: MyPageLocationScreen,
  notices: MyPageNoticesScreen,
  faq: MyPageFaqScreen,
  terms: MyPageTermsScreen,
  privacy: MyPagePrivacyScreen,
  'saved-courses': MyPageSavedCoursesScreen,
  'past-trips': MyPagePastTripsScreen,
  'visited-regions': MyPageVisitedRegionsScreen,
} satisfies Record<MyPageSection, React.ComponentType>;

export function MyPageSectionScreen({ section }: { section: MyPageSection }) {
  const SectionScreen = sections[section];
  return <SectionScreen />;
}
