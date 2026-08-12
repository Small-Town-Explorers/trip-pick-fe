declare module '*?react' {
  import type { FC } from 'react';

  const SvgComponent: FC<{ height?: number | string; width?: number | string }>;
  export default SvgComponent;
}
