import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

type RotatingStatusProps = {
  messages: readonly string[];
  visible: boolean;
};

const CHANGE_INTERVAL = 1_500;
const ANIMATION_DURATION = 220;
const TRAVEL_DISTANCE = 12;

const selectNextMessage = (messages: readonly string[], currentMessage: string) => {
  if (messages.length <= 1) return messages[0] ?? '';

  const nextMessages = messages.filter((message) => message !== currentMessage);
  return nextMessages[Math.floor(Math.random() * nextMessages.length)];
};

export function RotatingStatus({ messages, visible }: RotatingStatusProps) {
  const [message, setMessage] = useState(messages[0] ?? '');
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;

    let activeAnimation: Animated.CompositeAnimation | undefined;
    let isAnimating = false;

    const interval = setInterval(() => {
      if (isAnimating) return;
      isAnimating = true;

      activeAnimation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: TRAVEL_DISTANCE,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]);
      activeAnimation.start(({ finished }) => {
        if (!finished) {
          isAnimating = false;
          return;
        }

        setMessage((currentMessage) => selectNextMessage(messages, currentMessage));
        translateY.setValue(-TRAVEL_DISTANCE);

        activeAnimation = Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ]);
        activeAnimation.start(() => {
          isAnimating = false;
        });
      });
    }, CHANGE_INTERVAL);

    return () => {
      clearInterval(interval);
      activeAnimation?.stop();
    };
  }, [messages, opacity, translateY, visible]);

  return (
    <StatusViewport accessibilityLiveRegion="polite" accessibilityLabel={message}>
      <Status style={{ opacity, transform: [{ translateY }] }}>{message}</Status>
    </StatusViewport>
  );
}

const StatusViewport = styled.View({
  width: '100%',
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const Status = styled(Animated.Text)({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
