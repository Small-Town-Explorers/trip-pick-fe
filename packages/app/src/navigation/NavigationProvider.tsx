import { createContext, type PropsWithChildren, useContext } from 'react';

export type AppRoute = '/' | '/test-one' | '/test-two';

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
