import { View, type ViewStyle } from 'react-native';
import type { GradientPoint, LinearGradientProps } from './LinearGradient.types';

const defaultStart: GradientPoint = { x: 0.5, y: 0 };
const defaultEnd: GradientPoint = { x: 0.5, y: 1 };

const getLocation = (index: number, count: number, locations?: readonly number[]) => {
  const location = locations?.[index] ?? index / (count - 1);
  return Math.min(1, Math.max(0, location));
};

const getAngle = (start: GradientPoint, end: GradientPoint) => {
  const radians = Math.atan2(end.y - start.y, end.x - start.x);
  return (radians * 180) / Math.PI + 90;
};

export function LinearGradient({
  colors,
  locations,
  start = defaultStart,
  end = defaultEnd,
  style,
}: LinearGradientProps) {
  const stops = colors
    .map((color, index) => `${color} ${getLocation(index, colors.length, locations) * 100}%`)
    .join(', ');
  const backgroundStyle = {
    backgroundImage: `linear-gradient(${getAngle(start, end)}deg, ${stops})`,
  } as unknown as ViewStyle;

  return <View pointerEvents="none" style={[style, backgroundStyle]} />;
}
