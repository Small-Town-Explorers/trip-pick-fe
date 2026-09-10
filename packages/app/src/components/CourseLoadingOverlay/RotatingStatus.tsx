import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useEffect, useState } from 'react';

type RotatingStatusProps = {
  messages: readonly string[];
  visible: boolean;
};

type AnimationPhase = 'idle' | 'leaving' | 'entering';

const CHANGE_INTERVAL = 1_500;
const ANIMATION_DURATION = 220;
const TRAVEL_DISTANCE = 12;

const selectNextMessage = (messages: readonly string[], currentMessage: string) => {
  if (messages.length <= 1) return messages[0] ?? '';

  const nextMessages = messages.filter((message) => message !== currentMessage);
  return nextMessages[Math.floor(Math.random() * nextMessages.length)];
};

const motionStyles = {
  idle: { opacity: 1, transform: [{ translateY: 0 }] },
  leaving: { opacity: 0, transform: [{ translateY: TRAVEL_DISTANCE }] },
  entering: {
    opacity: 0,
    transform: [{ translateY: -TRAVEL_DISTANCE }],
    transitionDuration: '0ms',
  },
} as const;

export function RotatingStatus({ messages, visible }: RotatingStatusProps) {
  const [message, setMessage] = useState(messages[0] ?? '');
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');

  useEffect(() => {
    if (!visible) return;

    let messageTimer: ReturnType<typeof setTimeout> | undefined;
    let entranceTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setAnimationPhase('leaving');

      messageTimer = setTimeout(() => {
        setMessage((currentMessage) => selectNextMessage(messages, currentMessage));
        setAnimationPhase('entering');

        entranceTimer = setTimeout(() => {
          setAnimationPhase('idle');
        }, 16);
      }, ANIMATION_DURATION);
    }, CHANGE_INTERVAL);

    return () => {
      clearInterval(interval);
      if (messageTimer) clearTimeout(messageTimer);
      if (entranceTimer) clearTimeout(entranceTimer);
    };
  }, [messages, visible]);

  return (
    <StatusViewport accessibilityLiveRegion="polite" accessibilityLabel={message}>
      <Status style={motionStyles[animationPhase] as never}>{message}</Status>
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

const Status = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
  transitionProperty: 'opacity, transform',
  transitionDuration: `${ANIMATION_DURATION}ms`,
  transitionTimingFunction: 'ease',
} as never);
