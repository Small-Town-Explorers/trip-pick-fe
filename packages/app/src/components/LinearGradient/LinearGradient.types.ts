import type { StyleProp, ViewStyle } from 'react-native';

export type GradientPoint = {
  x: number;
  y: number;
};

export type LinearGradientProps = {
  colors: readonly [string, string, ...string[]];
  locations?: readonly number[];
  start?: GradientPoint;
  end?: GradientPoint;
  style?: StyleProp<ViewStyle>;
};
