import styled from '@emotion/native';
import { IconComponent } from '@components/Icons';
import { colors, typography, withAlpha } from '@styles';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  type LayoutChangeEvent,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';

interface BottomSheetModalProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: (controls: { close: () => void }) => ReactNode;
  accessibilityLabel?: string;
  avoidKeyboard?: boolean;
  baseHeight?: number;
  sheetStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_BASE_HEIGHT = 480;
const CLOSE_OFFSET = 700;
const CLOSE_THRESHOLD = 120;
const FADE_DURATION = 200;
const SLIDE_DURATION = 280;
const SHEET_TOP_GAP = 16;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function BottomSheetModal({
  visible,
  title,
  onClose,
  children,
  accessibilityLabel = '모달 닫기',
  avoidKeyboard = false,
  baseHeight = DEFAULT_BASE_HEIGHT,
  sheetStyle,
}: BottomSheetModalProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [opacity] = useState(() => new Animated.Value(0));
  const [offset] = useState(() => new Animated.Value(CLOSE_OFFSET));
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(baseHeight);
  const [dragStartHeight, setDragStartHeight] = useState(baseHeight);
  const minimumHeight = Math.max(0, baseHeight);
  const maximumHeight = Math.max(minimumHeight, screenHeight - SHEET_TOP_GAP);

  const handleSheetLayout = useCallback((event: LayoutChangeEvent) => {
    setSheetHeight(event.nativeEvent.layout.height);
  }, []);

  const handleShow = useCallback(() => {
    setCurrentHeight(null);
    setSheetHeight(minimumHeight);
    setDragStartHeight(minimumHeight);
    opacity.setValue(0);
    offset.setValue(CLOSE_OFFSET);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: 0,
        duration: SLIDE_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [minimumHeight, offset, opacity]);

  const close = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: CLOSE_OFFSET,
        duration: SLIDE_DURATION,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      setIsClosing(false);
      if (finished) {
        setCurrentHeight(null);
        onClose();
      }
    });
  }, [isClosing, offset, onClose, opacity]);

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
          offset.stopAnimation();
          setDragStartHeight(Math.max(minimumHeight, sheetHeight));
        },
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy < 0) {
            offset.setValue(0);
            setCurrentHeight(clamp(dragStartHeight - gesture.dy, minimumHeight, maximumHeight));
            return;
          }

          offset.setValue(Math.min(CLOSE_OFFSET, gesture.dy));
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 0 && (gesture.dy > CLOSE_THRESHOLD || gesture.vy > 0.8)) {
            close();
            return;
          }

          Animated.spring(offset, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 220,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(offset, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 220,
          }).start();
        },
      }),
    [close, dragStartHeight, maximumHeight, minimumHeight, offset, sheetHeight],
  );

  return (
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
        style={styles.container}
      >
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: offset }] }}>
          <Sheet
            onLayout={handleSheetLayout}
            style={[
              sheetStyle,
              { minHeight: minimumHeight },
              currentHeight === null ? undefined : { height: currentHeight },
            ]}
          >
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
            {children({ close })}
          </Sheet>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: withAlpha(colors.gray[300], 0.3),
  },
});

const Sheet = styled.View({
  width: '100%',
  alignSelf: 'center',
  paddingTop: 16,
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
});

const DragHandle = styled.View({
  width: '100%',
  height: 21,
  alignItems: 'center',
  justifyContent: 'flex-start',
});

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
