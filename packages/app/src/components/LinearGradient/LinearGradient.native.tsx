import { useId } from 'react';
import Svg, { Defs, LinearGradient as SvgGradient, Rect, Stop } from 'react-native-svg';
import type { GradientPoint, LinearGradientProps } from './LinearGradient.types';

const defaultStart: GradientPoint = { x: 0.5, y: 0 };
const defaultEnd: GradientPoint = { x: 0.5, y: 1 };

const getLocation = (index: number, count: number, locations?: readonly number[]) => {
  const location = locations?.[index] ?? index / (count - 1);
  return Math.min(1, Math.max(0, location));
};

const rgbaPattern =
  /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d*\.?\d+)\s*\)$/i;

const getNativeStop = (color: string) => {
  if (color.toLowerCase() === 'transparent') return { color: '#000000', opacity: 0 };

  const rgba = color.match(rgbaPattern);
  if (!rgba) return { color, opacity: 1 };

  const [, red, green, blue, alpha] = rgba;
  return {
    color: `rgb(${red}, ${green}, ${blue})`,
    opacity: Math.min(1, Math.max(0, Number(alpha))),
  };
};

export function LinearGradient({
  colors,
  locations,
  start = defaultStart,
  end = defaultEnd,
  style,
}: LinearGradientProps) {
  const gradientId = `linear-gradient-${useId().replace(/:/g, '')}`;

  return (
    <Svg pointerEvents="none" viewBox="0 0 1 1" preserveAspectRatio="none" style={style}>
      <Defs>
        <SvgGradient id={gradientId} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
          {colors.map((color, index) => {
            const stop = getNativeStop(color);
            return (
              <Stop
                key={`${color}-${index}`}
                offset={getLocation(index, colors.length, locations)}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            );
          })}
        </SvgGradient>
      </Defs>
      <Rect width="1" height="1" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
