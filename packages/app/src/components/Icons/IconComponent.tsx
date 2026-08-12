import { type IconName, icons } from './Icons.types';
import { colors } from '@styles/colors';

export const IconComponent = ({
  name,
  size,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) => {
  const sizes = icons[name].sizes;
  const defaultSize = Number(Object.keys(sizes)[0]);
  const resolvedSize = size ?? defaultSize;
  const Icon = sizes[resolvedSize] ?? sizes[defaultSize];
  const resolvedColor = color ?? colors.gray[900];

  return <Icon height={resolvedSize} width={resolvedSize} fill={resolvedColor} />;
};
