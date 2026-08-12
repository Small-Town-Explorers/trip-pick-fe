declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const SvgComponent: FC<SvgProps>;
  export default SvgComponent;
}

declare module '*?react' {
  import type { FC } from 'react';

  const SvgComponent: FC<{ height?: number | string; width?: number | string }>;
  export default SvgComponent;
}
