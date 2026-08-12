import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useAppNavigation, type AppRoute } from '../../navigation';
import {
  Page,
  Header,
  HeaderLogo,
  HeaderNavigation,
  HeaderNavigationButton,
  HeaderNavigationLabel,
  Content,
  Hero,
  HeroCopy,
  Eyebrow,
  Title,
  HeroDescription,
  SummaryBadge,
  SummaryDot,
  SummaryText,
  SectionStack,
  Section,
  SectionHeading,
  SectionTitle,
  SectionDescription,
} from './style';

type DesignSystemPage = 'colors' | 'typography' | 'components';

interface DesignSystemLayoutProps extends PropsWithChildren {
  activePage: DesignSystemPage;
  description: string;
  summary: string;
  title: string;
}

const navigationItems: readonly {
  label: string;
  page: DesignSystemPage;
  route: AppRoute;
}[] = [
  { label: 'Color', page: 'colors', route: '/design-system/colors' },
  { label: 'Typography', page: 'typography', route: '/design-system/typography' },
  { label: 'Component', page: 'components', route: '/design-system/components' },
];

export function DesignSystemLayout({
  activePage,
  children,
  description,
  summary,
  title,
}: DesignSystemLayoutProps) {
  return (
    <Page>
      <DesignSystemHeader activePage={activePage} />

      <ScrollView>
        <Content>
          <Hero>
            <HeroCopy>
              <Eyebrow>SODOSIRO DESIGN SYSTEM</Eyebrow>
              <Title>{title}</Title>
              <HeroDescription>{description}</HeroDescription>
            </HeroCopy>
            <SummaryBadge>
              <SummaryDot />
              <SummaryText>{summary}</SummaryText>
            </SummaryBadge>
          </Hero>
          <SectionStack>{children}</SectionStack>
        </Content>
      </ScrollView>
    </Page>
  );
}

const DesignSystemHeader = ({ activePage }: { activePage: DesignSystemPage }) => {
  const { navigate } = useAppNavigation();

  return (
    <Header>
      <HeaderLogo>SODOSIRO</HeaderLogo>
      <HeaderNavigation>
        {navigationItems.map((item) => {
          const isActive = item.page === activePage;
          return (
            <HeaderNavigationButton
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              key={item.page}
              onPress={() => navigate(item.route)}
              isActive={isActive}
            >
              <HeaderNavigationLabel isActive={isActive}>{item.label}</HeaderNavigationLabel>
            </HeaderNavigationButton>
          );
        })}
      </HeaderNavigation>
    </Header>
  );
};

export function DesignSystemSection({
  children,
  description,
  title,
  style,
}: PropsWithChildren<{ description?: string; title: string; style?: StyleProp<ViewStyle> }>) {
  return (
    <Section style={style}>
      <SectionHeading>
        <SectionTitle>{title}</SectionTitle>
        {description ? <SectionDescription>{description}</SectionDescription> : null}
      </SectionHeading>
      {children}
    </Section>
  );
}
