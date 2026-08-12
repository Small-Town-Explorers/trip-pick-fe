import styled from '@emotion/native';
import { Pressable, Text, View } from 'react-native';
import { colors, typography } from '../../styles';

export const Page = styled(View)({
  flex: 1,
  backgroundColor: colors.gray[25],
});

// Header

export const Header = styled(View)({
  zIndex: 10,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[200],
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 32,
  paddingVertical: 16,
  alignItems: 'center',
  rowGap: 12,
  flexWrap: 'wrap',
});

export const HeaderLogo = styled(Text)({
  ...typography.body2.semibold,
  color: colors.gray[1000],
  letterSpacing: 1,
});

export const HeaderNavigation = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
});

export const HeaderNavigationButton = styled(Pressable)<{ isActive: boolean }>(
  {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? colors.primary[100] : undefined,
  }),
);

export const HeaderNavigationLabel = styled(Text)<{ isActive: boolean }>(
  {
    ...typography.body3.semibold,
  },
  ({ isActive }) => ({
    color: isActive ? colors.primary[900] : colors.gray[600],
  }),
);

// Content

export const Content = styled(View)({
  width: '100%',
  maxWidth: 1536,
  marginHorizontal: 'auto',
  paddingHorizontal: 32,
  paddingTop: 72,
  paddingBottom: 120,
});

// Hero

export const Hero = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: 72,
});

export const HeroCopy = styled(View)({
  flexShrink: 1,
  gap: 12,
});

export const Eyebrow = styled(Text)({
  ...typography.caption1.medium,
  color: colors.primary[800],
  letterSpacing: 2,
});

export const Title = styled(Text)({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
  fontSize: 64,
  letterSpacing: -2,
  lineHeight: 72,
});

export const HeroDescription = styled(Text)({
  ...typography.body1.regular,
  marginTop: 8,
  color: colors.gray[700],
});

export const SummaryBadge = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 9,
  paddingHorizontal: 15,
  paddingVertical: 11,
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 999,
  backgroundColor: '#FFFFFF',
});

export const SummaryDot = styled(View)({
  width: 8,
  height: 8,
  borderRadius: 999,
  backgroundColor: colors.primary[600],
});

export const SummaryText = styled(Text)({
  ...typography.body3.semibold,
  color: colors.gray[800],
});

// Section

export const SectionStack = styled(View)({
  gap: 40,
});

export const Section = styled(View)({
  padding: 32,
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 28,
  backgroundColor: '#FFFFFF',
});

export const SectionHeading = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 28,
});

export const SectionTitle = styled(Text)({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
});

export const SectionDescription = styled(Text)({
  ...typography.body3.regular,
  color: colors.gray[600],
});
