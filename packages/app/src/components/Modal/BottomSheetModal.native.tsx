import styled from '@emotion/native';
import { IconComponent } from '@components/Icons';
import { colors, typography, withAlpha } from '@styles';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
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
  isExpandable?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_BASE_HEIGHT = 640;
const FADE_DURATION = 200;
const SLIDE_DURATION = 280;
const SHEET_TOP_GAP = 21;
const ANDROID_BOTTOM_BAR_HEIGHT = 48;

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
  const bottomBarHeight = Platform.OS === 'android' ? ANDROID_BOTTOM_BAR_HEIGHT : 0;
  const topBarHeight = Platform.OS === 'android' ? 24 : 0;
  const resizedHeight = baseHeight + bottomBarHeight;
  const minimumHeight = Math.max(0, resizedHeight);
  const maximumHeight = Math.max(minimumHeight, screenHeight + SHEET_TOP_GAP - topBarHeight);
  const [opacity] = useState(() => new Animated.Value(0));
  const [currentHeight] = useState(() => new Animated.Value(minimumHeight));
  const [offset] = useState(() => new Animated.Value(minimumHeight));
  const [isClosing, setIsClosing] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const handleShow = useCallback(() => {
    currentHeight.setValue(minimumHeight);
    setSheetExpanded(false);
    opacity.setValue(0);
    offset.setValue(minimumHeight);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: 0,
        duration: SLIDE_DURATION,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentHeight, minimumHeight, offset, opacity]);

  const close = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    Animated.parallel([
      Animated.timing(currentHeight, {
        toValue: 0,
        duration: SLIDE_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: minimumHeight,
        duration: SLIDE_DURATION,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      setIsClosing(false);
      if (finished) {
        onClose();
      }
    });
  }, [currentHeight, isClosing, minimumHeight, offset, onClose, opacity]);

  const settleHeight = useCallback(
    (height: number) => {
      Animated.parallel([
        Animated.timing(currentHeight, {
          toValue: height,
          duration: SLIDE_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: SLIDE_DURATION,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [currentHeight, offset],
  );

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
          currentHeight.stopAnimation();
          offset.stopAnimation();
          currentHeight.setValue(sheetExpanded ? maximumHeight : minimumHeight);
          offset.setValue(0);
        },
        onPanResponderMove: (_, gesture) => {
          const nextHeight = Math.max(
            0,
            Math.min(
              (sheetExpanded ? maximumHeight : minimumHeight) - gesture.dy,
              isExpandable ? maximumHeight : minimumHeight,
            ),
          );
          currentHeight.setValue(nextHeight);
          offset.setValue(nextHeight < minimumHeight ? minimumHeight - nextHeight : 0);
        },
        onPanResponderRelease: (_, gesture) => {
          const startHeight = sheetExpanded ? maximumHeight : minimumHeight;
          const betweenHeight = maximumHeight - minimumHeight;

          if (
            startHeight - gesture.dy < minimumHeight - 120 ||
            (startHeight - gesture.dy < minimumHeight && gesture.vy > 0.3)
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
              settleHeight(maximumHeight);
            } else {
              settleHeight(minimumHeight);
            }
          } else if (gesture.dy > betweenHeight * 0.3 || (gesture.dy > 0 && gesture.vy > 0.3)) {
            setSheetExpanded(false);
            settleHeight(minimumHeight);
          } else {
            settleHeight(maximumHeight);
          }
        },
        onPanResponderTerminate: () => {},
      }),
    [
      close,
      currentHeight,
      isExpandable,
      maximumHeight,
      minimumHeight,
      offset,
      settleHeight,
      sheetExpanded,
    ],
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
        <Sheet
          style={[
            sheetStyle,
            {
              minHeight: minimumHeight,
              height: currentHeight,
              transform: [{ translateY: offset }],
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
          <SheetContent style={{ paddingBottom: bottomBarHeight }}>
            {children({ close })}
          </SheetContent>
        </Sheet>
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

const Sheet = styled(Animated.View)({
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
