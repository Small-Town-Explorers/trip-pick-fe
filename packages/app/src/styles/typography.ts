import type { TextStyle } from 'react-native';

export const fontFamilies = {
  pretendard: 'Pretendard',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export const typographyMetrics = {
  lineHeightRatio: 1.35,
  letterSpacingRatio: 0.01,
} as const;

function createTypographyStyle(
  fontSize: number,
  fontWeight: (typeof fontWeights)[keyof typeof fontWeights],
) {
  return {
    fontFamily: fontFamilies.pretendard,
    fontSize,
    fontWeight,
    lineHeight: fontSize * typographyMetrics.lineHeightRatio,
    letterSpacing: fontSize * typographyMetrics.letterSpacingRatio,
  } as const;
}

export const typography = {
  heading1: {
    semibold: createTypographyStyle(28, fontWeights.semibold),
  },
  heading2: {
    semibold: createTypographyStyle(24, fontWeights.semibold),
    medium: createTypographyStyle(24, fontWeights.medium),
  },
  heading3: {
    semibold: createTypographyStyle(22, fontWeights.semibold),
    medium: createTypographyStyle(22, fontWeights.medium),
  },
  heading4: {
    semibold: createTypographyStyle(22, fontWeights.semibold),
    medium: createTypographyStyle(22, fontWeights.medium),
  },
  body1: {
    semibold: createTypographyStyle(18, fontWeights.semibold),
    medium: createTypographyStyle(18, fontWeights.medium),
    regular: createTypographyStyle(18, fontWeights.regular),
  },
  body2: {
    semibold: createTypographyStyle(16, fontWeights.semibold),
    medium: createTypographyStyle(16, fontWeights.medium),
    regular: createTypographyStyle(16, fontWeights.regular),
  },
  body3: {
    semibold: createTypographyStyle(14, fontWeights.semibold),
    medium: createTypographyStyle(14, fontWeights.medium),
    regular: createTypographyStyle(14, fontWeights.regular),
  },
  caption1: {
    medium: createTypographyStyle(12, fontWeights.medium),
    regular: createTypographyStyle(12, fontWeights.regular),
  },
  caption2: {
    medium: createTypographyStyle(11, fontWeights.medium),
    regular: createTypographyStyle(11, fontWeights.regular),
  },
  caption3: {
    medium: createTypographyStyle(10, fontWeights.medium),
    regular: createTypographyStyle(10, fontWeights.regular),
  },
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;
export type FontWeightToken = keyof typeof fontWeights;
export type TypographyToken = keyof typeof typography;
export type TypographyStyle = ReturnType<typeof createTypographyStyle>;
