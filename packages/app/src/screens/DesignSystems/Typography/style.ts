import styled from '@emotion/native';
import { ScrollView, Text, View } from 'react-native';
import { colors, typography, fontWeights } from '../../../styles';

type columns = 'name' | 'size' | 'weight' | 'lineHeight' | 'letterSpacing';

// Table

export const TableScroll = styled(ScrollView)({
  borderTopWidth: 1,
  borderTopColor: colors.gray[100],
});

export const Table = styled(View)({
  flexGrow: 1,
  minWidth: 920,
});

export const TableRow = styled(View, {
  shouldForwardProp: (prop) => prop !== 'header',
})<{
  header?: boolean;
}>(({ header }) => ({
  minHeight: header ? 72 : 148,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 36,
  borderTopWidth: header ? 0 : 1,
  borderTopColor: colors.gray[100],
  backgroundColor: header ? colors.gray[50] : '#FFFFFF',
}));

export const TableColumn = styled(View, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type: columns }>(({ type }) => {
  switch (type) {
    case 'name':
      return { flexGrow: 1, minWidth: 240 };
    case 'size':
      return { width: 110 };
    case 'weight':
      return { width: 190, gap: 5 };
    case 'lineHeight':
      return { width: 130 };
    case 'letterSpacing':
      return { width: 130 };
  }
});

export const TableHeaderText = styled(Text)({
  fontWeight: fontWeights.semibold,
  color: colors.gray[600],
});
export const SampleName = styled(Text)({
  color: colors.gray[1000],
});
export const ValueText = styled(Text)({
  fontWeight: fontWeights.medium,
  color: colors.gray[800],
});
export const WeightText = styled(Text)({
  color: colors.gray[900],
});

// Preview

export const PreviewSection = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 48,
  padding: 40,
  borderRadius: 28,
  backgroundColor: colors.primary[1100],
});

export const PreviewMeta = styled(View)({
  minWidth: 240,
  gap: 10,
});

export const PreviewTitle = styled(Text)({
  ...typography.heading2.semibold,
  color: colors.gray[100],
});

export const PreviewLabel = styled(Text)({
  ...typography.caption1.regular,
  color: colors.primary[300],
});

export const PreviewCopy = styled(View)({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 520,
  gap: 14,
});

export const PreviewHeading = styled(Text)({
  ...typography.heading1.semibold,
  color: '#FFFFFF',
});

export const PreviewBody = styled(Text)({
  ...typography.body1.regular,
  color: colors.primary[100],
});

export const PreviewCaption = styled(Text)({
  ...typography.caption1.medium,
  marginTop: 8,
  color: colors.sub[300],
});
