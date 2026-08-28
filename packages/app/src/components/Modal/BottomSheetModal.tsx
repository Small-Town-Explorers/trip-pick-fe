import { css, Global, keyframes } from '@emotion/react';
import styled from '@emotion/native';
import { colors, MAX_SCREEN_SIZE, typography } from '@styles';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  type LayoutChangeEvent,
  Modal,
  PanResponder,
  Platform,
  type StyleProp,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { IconComponent } from '@components/Icons';

interface WebDataProps {
  dataSet?: Record<string, string>;
}

interface BottomSheetModalProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: (controls: { close: () => void }) => ReactNode;
  accessibilityLabel?: string;
  avoidKeyboard?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_EXPANDED_OFFSET = -120;
const CLOSE_OFFSET = 700;
const CLOSE_THRESHOLD = 120;
const FADE_DURATION = 200;
const SLIDE_DURATION = 280;
const SHEET_TOP_GAP = -21;

const clampOffset = (offset: number, expandedOffset: number) =>
  Math.min(CLOSE_OFFSET, Math.max(expandedOffset, offset));

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});
const slideDown = keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: 'translateY(100%)' },
});

const motionStyles = css`
  [data-bottom-sheet-backdrop='opening'] {
    animation: ${fadeIn} ${FADE_DURATION}ms ease-out both;
  }

  [data-bottom-sheet-backdrop='closing'] {
    animation: ${fadeOut} ${FADE_DURATION}ms ease-out forwards;
  }

  [data-bottom-sheet='opening'] {
    animation: ${slideUp} ${SLIDE_DURATION}ms ease-out both;
  }

  [data-bottom-sheet='settling'] {
    transition: transform 220ms ease-out;
  }

  [data-bottom-sheet='closing'] {
    animation: ${slideDown} ${SLIDE_DURATION}ms ease-in forwards;
  }

  [data-bottom-sheet='dragging'] {
    cursor: grabbing;
    transition: none;
  }
`;

export function BottomSheetModal({
  visible,
  title,
  onClose,
  children,
  accessibilityLabel = '모달 닫기',
  avoidKeyboard = false,
  sheetStyle,
}: BottomSheetModalProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [settledOffset, setSettledOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const expandedOffset =
    sheetHeight === 0
      ? DEFAULT_EXPANDED_OFFSET
      : Math.min(0, sheetHeight - (screenHeight - SHEET_TOP_GAP));

  const handleSheetLayout = useCallback((event: LayoutChangeEvent) => {
    setSheetHeight(event.nativeEvent.layout.height);
  }, []);

  const close = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    setIsDragging(false);
    setSettledOffset(CLOSE_OFFSET);
    setDragOffset(CLOSE_OFFSET);

    setTimeout(() => {
      setIsClosing(false);
      setSettledOffset(0);
      setDragOffset(null);
      onClose();
    }, SLIDE_DURATION);
  }, [isClosing, onClose]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => setIsDragging(true),
        onPanResponderMove: (_, gesture) =>
          setDragOffset(clampOffset(settledOffset + gesture.dy, expandedOffset)),
        onPanResponderRelease: (_, gesture) => {
          const nextOffset = clampOffset(settledOffset + gesture.dy, expandedOffset);

          if (nextOffset > CLOSE_THRESHOLD || gesture.vy > 0.8) {
            close();
            return;
          }

          const snapOffset =
            nextOffset < expandedOffset / 2 || gesture.vy < -0.5 ? expandedOffset : 0;
          setIsDragging(false);
          setSettledOffset(snapOffset);
          setDragOffset(snapOffset);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          setDragOffset(settledOffset);
        },
      }),
    [close, expandedOffset, settledOffset],
  );

  const sheetMotion = isClosing
    ? 'closing'
    : isDragging
      ? 'dragging'
      : dragOffset === null
        ? 'opening'
        : 'settling';

  return (
    <>
      <Global styles={motionStyles} />
      <Modal
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
        transparent
        visible={visible}
      >
        <KeyboardAvoidingView
          behavior={avoidKeyboard && Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            maxWidth: MAX_SCREEN_SIZE,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Backdrop
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            dataSet={{ bottomSheetBackdrop: isClosing ? 'closing' : 'opening' }}
            onPress={close}
          />
          <Sheet
            dataSet={{ bottomSheet: sheetMotion }}
            onLayout={handleSheetLayout}
            style={[
              sheetStyle,
              dragOffset === null ? undefined : { transform: [{ translateY: dragOffset }] },
            ]}
          >
            <SheetFill style={{ bottom: expandedOffset, height: -expandedOffset }} />
            <DragHandle {...panResponder.panHandlers}>
              <Handle />
            </DragHandle>
            {title ? (
              <Header>
                <HeaderSpacer />
                <Title>{title}</Title>
                <CloseButton
                  accessibilityRole="button"
                  accessibilityLabel="닫기"
                  onPress={close}
                >
                  <IconComponent name="cross" size={24} color={colors.gray[400]} />
                </CloseButton>
              </Header>
            ) : null}
            {children({ close })}
          </Sheet>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const Backdrop = styled.Pressable<WebDataProps>({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(181, 186, 187, 0.3)',
} as never);

const Sheet = styled.View<WebDataProps>({
  width: '100%',
  alignSelf: 'center',
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
});

const SheetFill = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  backgroundColor: '#FFFFFF',
  pointerEvents: 'none',
});

const DragHandle = styled.View({
  width: '100%',
  paddingVertical: 16,
  height: 21,
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
} as never);

const Handle = styled.View({
  width: 48,
  height: 5,
  alignSelf: 'center',
  backgroundColor: colors.gray[100],
  borderRadius: 9999,
});

const Header = styled.View({
  width: '100%',
  height: 43,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
});
const HeaderSpacer = styled.View({ width: 24, height: 24 });
const Title = styled.Text({
  ...typography.heading4.semibold,
  color: colors.gray[1000],
});
const CloseButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});
