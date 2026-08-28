import { createContext, type PropsWithChildren, useContext } from 'react';

export type MyPageSection =
  'account' | 'notifications' | 'notices' | 'faq' | 'terms' | 'privacy' | 'location';
export type MyPageSectionRoute = MyPageSection;

export type AppRoute =
  | '/'
  | '/design-system/colors'
  | '/design-system/typography'
  | '/design-system/components'
  | '/course-create'
  | `/trip-detail/${string}`
  | `/place-detail/${string}`
  | `/course-result/${string}`
  | '/my-trips'
  | `/my-trips/${string}`
  | '/my-page'
  | `/my-page/${MyPageSection}`;

export const appRoutes = {
  home: '/' as const,
  designSystemColors: '/design-system/colors' as const,
  tripDetail: (id: string) => `/trip-detail/${encodeURIComponent(id)}` as const,
  placeDetail: (id: string) => `/place-detail/${encodeURIComponent(id)}` as const,
  courseCreate: '/course-create' as const,
  courseResult: (id: string) => `/course-result/${encodeURIComponent(id)}` as const,
  myTrips: '/my-trips' as const,
  myTripFolder: (id: string) => `/my-trips/${encodeURIComponent(id)}` as const,
  myPage: '/my-page' as const,
  myPageSection: (section: MyPageSection) => `/my-page/${section}` as const,
};

type Navigation = {
  navigate: (route: AppRoute) => void;
  replace: (route: AppRoute) => void;
  back: () => void;
};

type NavigationProviderProps = PropsWithChildren<{
  navigation: Navigation;
}>;

const NavigationContext = createContext<Navigation | null>(null);

export function NavigationProvider({ children, navigation }: NavigationProviderProps) {
  return <NavigationContext.Provider value={navigation}>{children}</NavigationContext.Provider>;
}

export function useAppNavigation() {
  const navigation = useContext(NavigationContext);

  if (!navigation) {
    throw new Error('useAppNavigation must be used inside NavigationProvider.');
  }

  return navigation;
}
