import styled from '@emotion/native';
import TmpLoadingArtwork from '@assets/images/loading_tmp/TmpLoadingAnimated.svg?react';
import type { CSSProperties } from 'react';

type TmpLoadingAnimatedProps = {
  accessibilityLabel: string;
  variant?: 'generate' | 'regenerate';
};

const ILLUSTRATION_WIDTH = 320;
const ILLUSTRATION_HEIGHT = (ILLUSTRATION_WIDTH * 344) / 231;

const REGENERATING_ARTWORK_STYLE = {
  '--tmp-map-0': '#21BDCB',
  '--tmp-map-1': '#21BDCB',
  '--tmp-map-2': '#45C7CE',
  '--tmp-map-3': '#68CFD1',
  '--tmp-map-4': '#81D5D4',
  '--tmp-map-5': '#A2DEDC',
  '--tmp-map-6': '#C4E9E2',
  '--tmp-map-7': '#E4F4F0',
  '--tmp-magnifier-start': '#087F8B',
  '--tmp-magnifier-end': '#21BDCB',
} as CSSProperties;

export function TmpLoadingAnimated({
  accessibilityLabel,
  variant = 'generate',
}: TmpLoadingAnimatedProps) {
  return (
    <IllustrationCanvas accessible accessibilityLabel={accessibilityLabel}>
      <TmpLoadingArtwork
        width={ILLUSTRATION_WIDTH}
        height={ILLUSTRATION_HEIGHT}
        style={variant === 'regenerate' ? REGENERATING_ARTWORK_STYLE : undefined}
      />
    </IllustrationCanvas>
  );
}

const IllustrationCanvas = styled.View({
  width: ILLUSTRATION_WIDTH,
  aspectRatio: 231 / 344,
  pointerEvents: 'none',
});
