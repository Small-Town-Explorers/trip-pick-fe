import styled from '@emotion/native';
import { Text, View } from 'react-native';
import { colors, typography } from '../../../styles';

export const Grid = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
});

export const SwatchCard = styled(View)({
  width: 128,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: colors.gray[100],
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
});

export const SwatchColor = styled(View)(
  {
    minHeight: 118,
    padding: 12,
    alignItems: 'flex-end',
  },
  ({ backgroundColor }: { backgroundColor: string }) => ({
    backgroundColor,
  }),
);

export const SwatchToken = styled(Text)(
  {
    ...typography.caption2.medium,
  },
  ({ isDark }: { isDark: boolean }) => ({
    color: isDark ? colors.gray[25] : colors.gray[900],
  }),
);

export const SwatchMeta = styled(View)({
  padding: 12,
  gap: 4,
});

export const SwatchName = styled(Text)({
  ...typography.caption1.medium,
  color: colors.gray[800],
});

export const SwatchHex = styled(Text)({
  ...typography.caption2.regular,
  color: colors.gray[500],
});

export const SemanticGrid = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 36,
});

export const SemanticGroup = styled(View)({
  width: '100%',
  gap: 16,
});

export const SemanticTitle = styled(Text)({
  ...typography.body3.semibold,
  color: colors.gray[800],
});
