import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, shadows, typography } from '@styles';
import {
  type PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, PanResponder, Platform } from 'react-native';

interface EditTripSpotCardProps {
  image?: string | null;
  name: string;
  description: string;
  dropOffsets: number[];
  shiftStep?: number;
  committing?: boolean;
  onDelete?: () => void;
  onDrag: (offset: number) => void;
  onDragCancel: () => void;
  onDrop: (offset: number) => void;
}

interface CourseResultDragHandleProps {
  dropOffsets: number[];
  shiftStep: number;
  committing: boolean;
  onDrag: (offset: number) => void;
  onDragCancel: () => void;
  onDrop: (offset: number) => void;
}

const CARD_STEP = 109;

const nearestOffset = (offsets: number[], dy: number) =>
  offsets.reduce(
    (nearest, offset) => (Math.abs(offset - dy) < Math.abs(nearest - dy) ? offset : nearest),
    0,
  );
const DROP_DURATION = 140;

const CourseResultDragHandle = ({
  dropOffsets,
  shiftStep,
  committing,
  onDrag,
  onDragCancel,
  onDrop,
  children,
}: PropsWithChildren<CourseResultDragHandleProps>) => {
  const [translateY] = useState(() => new Animated.Value(0));
  const [shiftY] = useState(() => new Animated.Value(0));
  const [dragging, setDragging] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const lastStep = useRef(0);
  const callbacks = useRef({ onDrag, onDragCancel, onDrop });
  const offsetsRef = useRef(dropOffsets);

  useLayoutEffect(() => {
    offsetsRef.current = dropOffsets;
  }, [dropOffsets]);

  useEffect(() => {
    callbacks.current = { onDrag, onDragCancel, onDrop };
  }, [onDrag, onDragCancel, onDrop]);

  useLayoutEffect(() => {
    const toValue = shiftStep * CARD_STEP;

    if (Platform.OS === 'web' || committing) {
      shiftY.stopAnimation();
      shiftY.setValue(toValue);
      return;
    }

    Animated.spring(shiftY, {
      toValue,
      damping: 24,
      stiffness: 280,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  }, [shiftStep, shiftY, committing]);

  const panResponder = useMemo(
    () =>
      // Refs are accessed only after a gesture starts, never while rendering.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          if (Platform.OS === 'web') {
            translateY.setValue(0);
          } else {
            translateY.stopAnimation();
          }
          lastStep.current = 0;
          setDragging(true);
          callbacks.current.onDrag(0);
        },
        onPanResponderMove: (_, gesture) => {
          const minOffset = Math.min(...offsetsRef.current);
          const maxOffset = Math.max(...offsetsRef.current);
          translateY.setValue(Math.max(minOffset, Math.min(maxOffset, gesture.dy)));

          const step = nearestOffset(offsetsRef.current, gesture.dy);
          if (step !== lastStep.current) {
            lastStep.current = step;
            callbacks.current.onDrag(step);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          const step = nearestOffset(offsetsRef.current, gesture.dy);

          if (step !== lastStep.current) {
            lastStep.current = step;
            callbacks.current.onDrag(step);
          }

          if (Platform.OS === 'web') {
            setDragging(false);
            requestAnimationFrame(() => {
              translateY.setValue(step);

              setTimeout(() => {
                setFinalizing(true);

                requestAnimationFrame(() => {
                  translateY.setValue(0);
                  callbacks.current.onDrop(step);

                  requestAnimationFrame(() => setFinalizing(false));
                });
              }, DROP_DURATION);
            });
            return;
          }

          Animated.spring(translateY, {
            toValue: step,
            damping: 22,
            stiffness: 240,
            restDisplacementThreshold: 0.5,
            restSpeedThreshold: 0.5,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (!finished) return;
            translateY.setValue(0);
            setDragging(false);
            callbacks.current.onDrop(step);
          });
        },
        onPanResponderTerminate: () => {
          if (Platform.OS === 'web') {
            translateY.setValue(0);
            setDragging(false);
            callbacks.current.onDragCancel();
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            damping: 22,
            stiffness: 240,
            restDisplacementThreshold: 0.5,
            restSpeedThreshold: 0.5,
            useNativeDriver: true,
          }).start(() => {
            setDragging(false);
            callbacks.current.onDragCancel();
          });
        },
      }),
    [translateY],
  );

  return (
    <Card
      committing={committing || finalizing}
      dragging={dragging}
      style={{ transform: [{ translateY: shiftY }, { translateY }] }}
    >
      <DragHandle
        accessibilityLabel="일정 순서 변경"
        accessibilityRole="adjustable"
        {...panResponder.panHandlers}
      >
        <IconComponent name="drag" color={colors.gray[200]} />
      </DragHandle>
      {children}
    </Card>
  );
};

export function EditTripSpotCard({
  image,
  name,
  description,
  dropOffsets,
  shiftStep = 0,
  committing = false,
  onDelete,
  onDrag,
  onDragCancel,
  onDrop,
}: EditTripSpotCardProps) {
  return (
    <CourseResultDragHandle
      dropOffsets={dropOffsets}
      shiftStep={shiftStep}
      committing={committing}
      onDrag={onDrag}
      onDragCancel={onDragCancel}
      onDrop={onDrop}
    >
      <Thumbnail
        source={image ? { uri: image } : undefined}
        accessibilityLabel={name}
        resizeMode="cover"
      />
      <Info>
        <Header>
          <Name numberOfLines={1}>{name}</Name>
          <RemoveButton
            accessibilityRole="button"
            accessibilityLabel={`${name} 삭제`}
            onPress={onDelete}
          >
            <IconComponent name="cross" size={20} color={colors.gray[500]} />
          </RemoveButton>
        </Header>
        <Description numberOfLines={2}>{description}</Description>
      </Info>
    </CourseResultDragHandle>
  );
}

const Card = styled(Animated.View)<{ committing: boolean; dragging: boolean }>(
  ({ committing, dragging }) => ({
    flex: 1,
    minWidth: 0,
    height: 93,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    zIndex: dragging ? 10 : 0,
    opacity: dragging ? 0.92 : 1,

    ...shadows[2],
    ...Platform.select({
      web: {
        transitionDuration: dragging || committing ? '0ms' : `${DROP_DURATION}ms`,
        transitionProperty: 'transform',
        transitionTimingFunction: 'ease-out',
        willChange: 'transform',
      },
    }),
  }),
);

const DragHandle = styled.View({
  width: 28,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 5,
  ...Platform.select({ web: { cursor: 'grab', touchAction: 'none', userSelect: 'none' } }),
} as never);

const Thumbnail = styled.Image({
  width: 61,
  height: 61,
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: colors.gray[100],
});

const Info = styled.View({
  flex: 1,
  minWidth: 0,
  gap: 6,
});

const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Name = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const RemoveButton = styled.Pressable({
  zIndex: 2,
  alignItems: 'center',
  justifyContent: 'center',
});

const Description = styled.Text({
  flexShrink: 1,
  width: '100%',
  ...typography.caption1.regular,
  color: colors.gray[700],
});
