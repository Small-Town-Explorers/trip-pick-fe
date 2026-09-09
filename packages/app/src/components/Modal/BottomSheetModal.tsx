import { css, Global, keyframes } from '@emotion/react';
import styled from '@emotion/native';
import { colors, MAX_SCREEN_SIZE, typography, withAlpha } from '@styles';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
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
  baseHeight?: number;
  isExpandable?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_BASE_HEIGHT = 640;
const FADE_DURATION = 200;
const SLIDE_DURATION = 280;
const SHEET_TOP_GAP = 21;

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

const motionStyles = css`
  [data-bottom-sheet-backdrop='opening'] {
    animation: ${fadeIn} ${FADE_DURATION}ms ease-out both;
  }

  [data-bottom-sheet-backdrop='closing'] {
    animation: ${fadeOut} ${FADE_DURATION}ms ease-out forwards;
  }

  [data-bottom-sheet='opening'] {
    transition:
      transform ${SLIDE_DURATION}ms ease-out,
      height ${SLIDE_DURATION}ms ease-out;
    animation: ${slideUp} ${SLIDE_DURATION}ms ease-out both;
  }

  [data-bottom-sheet='settling'] {
    transition: transform 220ms ease-out;
  }

  [data-bottom-sheet='default'] {
    transition:
      transform ${SLIDE_DURATION}ms ease-out,
      height ${SLIDE_DURATION}ms ease-out;
  }

  [data-bottom-sheet='closing'] {
    transition:
      transform ${SLIDE_DURATION}ms ease-out,
      height ${SLIDE_DURATION}ms ease-out;
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
  baseHeight = DEFAULT_BASE_HEIGHT,
  isExpandable = true,
  sheetStyle,
}: BottomSheetModalProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [isClosing, setIsClosing] = useState(false);
  const minimumHeight = Math.max(0, baseHeight);
  const maximumHeight = Math.max(minimumHeight, screenHeight + SHEET_TOP_GAP);

  const [sheetStatus, setSheetStatus] = useState<'opening' | 'default' | 'dragging' | 'closing'>(
    'opening',
  );
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const handleShow = useCallback(() => {
    setSheetStatus('opening');
    setCurrentHeight(baseHeight);
    setSheetExpanded(false);

    setTimeout(() => {
      setSheetStatus('default');
    }, SLIDE_DURATION);
  }, [baseHeight]);

  const close = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    setCurrentHeight(0);
    setSheetStatus('closing');

    setTimeout(() => {
      setIsClosing(false);
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
        onPanResponderGrant: () => {
          setCurrentHeight(sheetExpanded ? maximumHeight : minimumHeight);
          setSheetStatus('dragging');
        },
        onPanResponderMove: (_, gesture) => {
          setCurrentHeight(
            Math.min(
              (sheetExpanded ? maximumHeight : minimumHeight) - gesture.dy,
              isExpandable ? maximumHeight : minimumHeight,
            ),
          );
        },
        onPanResponderRelease: (_, gesture) => {
          const betweenHeight = maximumHeight - minimumHeight;

          if (
            (sheetExpanded ? maximumHeight : minimumHeight) - gesture.dy < minimumHeight - 120 ||
            ((sheetExpanded ? maximumHeight : minimumHeight) - gesture.dy < minimumHeight &&
              gesture.vy > 0.3)
          ) {
            close();
            return;
          }

          if (!sheetExpanded) {
            if (
              isExpandable &&
              (gesture.dy < betweenHeight * -0.3 || (gesture.dy < 0 && gesture.vy < -0.3))
            ) {
              setSheetExpanded(true);
              setCurrentHeight(maximumHeight);
            } else {
              setCurrentHeight(minimumHeight);
            }
          } else {
            if (gesture.dy > betweenHeight * 0.3 || (gesture.dy > 0 && gesture.vy > 0.3)) {
              setSheetExpanded(false);
              setCurrentHeight(minimumHeight);
            } else {
              setCurrentHeight(maximumHeight);
            }
          }

          setSheetStatus('default');
        },
        onPanResponderTerminate: () => {},
      }),
    [close, minimumHeight, maximumHeight, sheetExpanded, isExpandable],
  );

  return (
    <>
      <Global styles={motionStyles} />
      <Modal
        animationType="none"
        onRequestClose={close}
        onShow={handleShow}
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
            dataSet={{ bottomSheetBackdrop: sheetStatus }}
            onPress={close}
          />
          <Sheet
            dataSet={{ bottomSheet: sheetStatus }}
            style={[
              sheetStyle,
              { minHeight: minimumHeight },
              {
                height: currentHeight,
              },
              currentHeight < minimumHeight && {
                transform: [{ translateY: minimumHeight - currentHeight }],
              },
            ]}
          >
            <SheetHeader>
              <DragHandle {...panResponder.panHandlers}>
                <Handle />
              </DragHandle>
              {title ? (
                <Header>
                  <HeaderSpacer />
                  <Title>{title}</Title>
                  <CloseButton accessibilityRole="button" accessibilityLabel="닫기" onPress={close}>
                    <IconComponent name="cross" size={24} color={colors.gray[400]} />
                  </CloseButton>
                </Header>
              ) : null}
            </SheetHeader>
            <SheetContent>{children({ close })}</SheetContent>
          </Sheet>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const Backdrop = styled.Pressable<WebDataProps>({
  position: 'absolute',
  inset: 0,
  backgroundColor: withAlpha(colors.gray[300], 0.3),
} as never);

const Sheet = styled.View<WebDataProps>({
  position: 'relative',
  width: '100%',
  alignSelf: 'center',
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
});

const SheetHeader = styled.View({
  paddingHorizontal: 20,
});

const DragHandle = styled.View({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
  paddingVertical: 16,
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
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
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

const SheetContent = styled.View({
  width: '100%',
  flex: 1,
});
