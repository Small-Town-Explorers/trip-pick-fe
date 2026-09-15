import styled from '@emotion/native';
import { colors, typography } from '@styles';
import type { PropsWithChildren } from 'react';
import { Header } from '@components/Header';
import { ContentScroll } from '@components/ContentScroll';

export function MyPageSectionLayout({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Screen>
      <Header title={title} />
      <ContentScroll>{children}</ContentScroll>
    </Screen>
  );
}

const Screen = styled.View({
  flex: 1,
  backgroundColor: colors.gray[25],
});

export const SectionCard = styled.View({
  padding: 16,
  gap: 8,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});
export const SectionLabel = styled.Text({
  ...typography.caption1.regular,
  color: colors.gray[500],
});
export const SectionValue = styled.Text({ ...typography.body2.regular, color: colors.gray[800] });
export const SectionRow = styled.Pressable({
  minHeight: 60,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});
export const SectionDocument = styled.View({
  padding: 20,
  gap: 20,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});
export const SectionDocumentTitle = styled.Text({
  ...typography.heading4.semibold,
  color: colors.gray[1000],
});
export const SectionDocumentText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});
