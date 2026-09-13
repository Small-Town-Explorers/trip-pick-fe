import Glitter from '@assets/images/loading_tmp/Glitter.svg';
import Magnifier from '@assets/images/loading_tmp/Magnifier.svg';
import MagnifierRegenerating from '@assets/images/loading_tmp/MagnifierRegenerating.svg';
import Map from '@assets/images/loading_tmp/Map.svg';
import MapRegenerating from '@assets/images/loading_tmp/MapRegenerating.svg';
import ShiningEffect from '@assets/images/loading_tmp/Shining effect.svg';
import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import styled from '@emotion/native';

type TmpLoadingAnimatedProps = {
  accessibilityLabel: string;
  variant?: 'generate' | 'regenerate';
};

const MAP_WIDTH = 203;
const MAP_HEIGHT = 318;

export function TmpLoadingAnimated({
  accessibilityLabel,
  variant = 'generate',
}: TmpLoadingAnimatedProps) {
  const [mapOpacity] = useState(() => new Animated.Value(0.5));
  const [magnifierX] = useState(() => new Animated.Value(-106));
  const [magnifierY] = useState(() => new Animated.Value(-160));
  const [topGlitterOpacity] = useState(() => new Animated.Value(1));
  const [bottomGlitterOpacity] = useState(() => new Animated.Value(0));
  const [shineY] = useState(() => new Animated.Value(-320));
  const [shineOpacity] = useState(() => new Animated.Value(0));
  const MapArtwork = variant === 'regenerate' ? MapRegenerating : Map;
  const MagnifierArtwork = variant === 'regenerate' ? MagnifierRegenerating : Magnifier;

  useEffect(() => {
    const timing = (value: Animated.Value, toValue: number, duration: number) =>
      Animated.timing(value, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });

    const moveMagnifier = (x: number, y: number) =>
      Animated.parallel([timing(magnifierX, x, 1_000), timing(magnifierY, y, 1_000)]);

    const mapAnimation = Animated.loop(
      Animated.sequence([timing(mapOpacity, 1, 2_000), timing(mapOpacity, 0.5, 2_000)]),
    );
    const magnifierAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1_000),
        moveMagnifier(18, -160),
        Animated.delay(1_000),
        moveMagnifier(-106, 72),
        Animated.delay(1_000),
        moveMagnifier(18, 72),
        Animated.delay(1_000),
        moveMagnifier(-106, -160),
      ]),
    );
    const glitterAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1_800),
        Animated.parallel([
          timing(topGlitterOpacity, 0, 200),
          timing(bottomGlitterOpacity, 1, 200),
        ]),
        Animated.delay(1_800),
        Animated.parallel([
          timing(topGlitterOpacity, 1, 200),
          timing(bottomGlitterOpacity, 0, 200),
        ]),
      ]),
    );
    const shineAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([timing(shineY, 350, 3_600), timing(shineOpacity, 0.75, 400)]),
        timing(shineOpacity, 0, 400),
      ]),
      { resetBeforeIteration: true },
    );

    mapAnimation.start();
    magnifierAnimation.start();
    glitterAnimation.start();
    shineAnimation.start();

    return () => {
      mapAnimation.stop();
      magnifierAnimation.stop();
      glitterAnimation.stop();
      shineAnimation.stop();
    };
  }, [
    bottomGlitterOpacity,
    magnifierX,
    magnifierY,
    mapOpacity,
    shineOpacity,
    shineY,
    topGlitterOpacity,
  ]);

  return (
    <IllustrationCanvas accessible accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[mapLayerStyle, { opacity: mapOpacity }]}>
        <MapArtwork width={MAP_WIDTH} height={MAP_HEIGHT} />
      </Animated.View>
      <ShineViewport>
        <Animated.View
          style={[shineLayerStyle, { opacity: shineOpacity, transform: [{ translateY: shineY }] }]}
        >
          <ShiningEffect width={300} height={300} />
        </Animated.View>
      </ShineViewport>
      <Animated.View style={[topRightGlitterStyle, { opacity: topGlitterOpacity }]}>
        <Glitter width={42} height={42} />
      </Animated.View>
      <Animated.View style={[bottomLeftGlitterStyle, { opacity: bottomGlitterOpacity }]}>
        <Glitter width={42} height={42} />
      </Animated.View>
      <Animated.View
        style={[
          magnifierLayerStyle,
          { transform: [{ translateX: magnifierX }, { translateY: magnifierY }] },
        ]}
      >
        <MagnifierArtwork width={94} height={94} />
      </Animated.View>
    </IllustrationCanvas>
  );
}

const IllustrationCanvas = styled.View({
  position: 'relative',
  width: 231,
  height: 344,
  marginBottom: 32,
  overflow: 'hidden',
  pointerEvents: 'none',
});

const ShineViewport = styled.View({
  position: 'absolute',
  left: 14,
  top: 13,
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  overflow: 'hidden',
});

const mapLayerStyle = {
  position: 'absolute' as const,
  left: 14,
  top: 13,
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
};

const shineLayerStyle = {
  position: 'absolute' as const,
  left: -49,
  top: 0,
  width: 300,
  height: 300,
};

const topRightGlitterStyle = {
  position: 'absolute' as const,
  right: 32,
  top: 72,
  width: 42,
  height: 42,
};

const bottomLeftGlitterStyle = {
  position: 'absolute' as const,
  left: 36,
  bottom: 76,
  width: 42,
  height: 42,
};

const magnifierLayerStyle = {
  position: 'absolute' as const,
  left: '50%' as const,
  top: '50%' as const,
  width: 94,
  height: 94,
};
