export const gray = {
  25: '#F9F9F9',
  50: '#F3F3F4',
  100: '#E6E8E8',
  200: '#CED1D2',
  300: '#B5BABB',
  400: '#9CA3A5',
  500: '#838C8E',
  600: '#6B7577',
  700: '#525E61',
  800: '#39474A',
  900: '#213034',
  1000: '#08191D',
} as const;

export const primary = {
  50: '#E9F2E3',
  100: '#D6E8CD',
  200: '#C3DFBC',
  300: '#A0CFA1',
  400: '#85C38C',
  500: '#66B574',
  600: '#43A558',
  700: '#379152',
  800: '#2C7D4C',
  900: '#206947',
  1000: '#155541',
  1100: '#09413B',
} as const;

export const sub = {
  100: '#E4F4F0',
  200: '#C4E9E2',
  300: '#81D5D4',
  400: '#21BDCB',
} as const;

export const semantic = {
  positive: '#3AD856',
  positiveLight: '#8EFBA1',
  positiveDisabled: '#E2F9E6',
  warning: '#F14827',
  warningLight: '#FF9D8A',
  warningDisabled: '#FDE4DF',
} as const;

export const colors = {
  gray,
  primary,
  sub,
  semantic,
} as const;

export type Colors = typeof colors;
export type GrayColorToken = keyof typeof gray;
export type PrimaryColorToken = keyof typeof primary;
export type SubColorToken = keyof typeof sub;
export type SemanticColorToken = keyof typeof semantic;
