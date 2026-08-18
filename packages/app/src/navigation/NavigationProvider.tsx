import { createContext, type PropsWithChildren, useContext } from 'react';

export type AppRoute =
  | '/'
  | '/design-system/colors'
  | '/design-system/typography'
  | '/design-system/components'
  | '/test-one'
  | '/test-two'
  | `/trip-detail/${string}`
  | `/place-detail/${string}`;

export const appRoutes = {
  home: '/' as const,
  designSystemColors: '/design-system/colors' as const,
  tripDetail: (id: string) => `/trip-detail/${encodeURIComponent(id)}` as const,
  placeDetail: (id: string) => `/place-detail/${encodeURIComponent(id)}` as const,
};

type Navigation = {
  navigate: (route: AppRoute) => void;
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
