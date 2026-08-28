import type { MyPageSection } from '../../navigation';
import { MyPageAccountScreen } from './Account/Screen';
import { MyPageFaqScreen } from './Faq/Screen';
import { MyPageLocationScreen } from './Location/Screen';
import { MyPageNoticesScreen } from './Notices/Screen';
import { MyPageNotificationsScreen } from './Notifications/Screen';
import { MyPagePrivacyScreen } from './Privacy/Screen';
import { MyPageTermsScreen } from './Terms/Screen';

const sections = {
  account: MyPageAccountScreen,
  notifications: MyPageNotificationsScreen,
  location: MyPageLocationScreen,
  notices: MyPageNoticesScreen,
  faq: MyPageFaqScreen,
  terms: MyPageTermsScreen,
  privacy: MyPagePrivacyScreen,
} satisfies Record<MyPageSection, React.ComponentType>;

export function MyPageSectionScreen({ section }: { section: MyPageSection }) {
  const SectionScreen = sections[section];
  return <SectionScreen />;
}
