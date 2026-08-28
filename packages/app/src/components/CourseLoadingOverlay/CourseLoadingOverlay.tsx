import CourseGeneratingImage from '@assets/images/course_generating.png';
import CourseRegeneratingImage from '@assets/images/course_regenerating.png';
import styled from '@emotion/native';
import { colors, MAX_SCREEN_SIZE, typography } from '@styles';
import { useCallback, useEffect, useRef } from 'react';
import { Modal, Platform, type ImageSourcePropType } from 'react-native';

interface CourseLoadingOverlayProps {
  visible: boolean;
  mode: 'generate' | 'regenerate';
  destination?: string;
  onCancel: () => void;
  onComplete: () => void;
}

export function CourseLoadingOverlay({
  visible,
  mode,
  destination,
  onCancel,
  onComplete,
}: CourseLoadingOverlayProps) {
  const historyEntryActive = useRef(false);
  const popHandler = useRef<(() => void) | null>(null);
  const pendingLeave = useRef<(() => void) | null>(null);
  const onCancelRef = useRef(onCancel);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCancelRef.current = onCancel;
    onCompleteRef.current = onComplete;
  }, [onCancel, onComplete]);

  const removeHistoryListener = useCallback(() => {
    if (Platform.OS !== 'web' || !popHandler.current) return;

    window.removeEventListener('popstate', popHandler.current, true);
    window.removeEventListener('hashchange', popHandler.current, true);
    popHandler.current = null;
  }, []);

  const leave = useCallback((callback: () => void) => {
    if (Platform.OS !== 'web' || !historyEntryActive.current) {
      callback();
      return;
    }

    pendingLeave.current = callback;
    window.history.back();
  }, []);

  const cancel = useCallback(() => leave(() => onCancelRef.current()), [leave]);
  const complete = useCallback(() => leave(() => onCompleteRef.current()), [leave]);

  useEffect(() => {
    if (!visible) return;

    if (Platform.OS === 'web') {
      if (!historyEntryActive.current) {
        historyEntryActive.current = true;
        const url = new URL(window.location.href);
        url.hash = 'course-loading';
        window.history.pushState(
          {
            ...window.history.state,
            courseLoadingOverlay: true,
          },
          '',
          url,
        );
      }
      const handlePop = () => {
        if (!historyEntryActive.current) return;

        historyEntryActive.current = false;
        const callback = pendingLeave.current ?? (() => onCancelRef.current());
        pendingLeave.current = null;
        removeHistoryListener();
        callback();
      };
      popHandler.current = handlePop;
      window.addEventListener('popstate', handlePop, true);
      window.addEventListener('hashchange', handlePop, true);
    }

    const timer = setTimeout(complete, 2000);
    return () => {
      clearTimeout(timer);
      pendingLeave.current = null;
      removeHistoryListener();
    };
  }, [complete, removeHistoryListener, visible]);

  const isGenerating = mode === 'generate';
  const image = isGenerating ? CourseGeneratingImage : CourseRegeneratingImage;

  return (
    <Modal animationType="none" onRequestClose={cancel} visible={visible} transparent>
      <Overlay>
        <Screen>
          <Illustration
            accessibilityLabel={
              isGenerating
                ? '숨겨진 여행지를 탐색하는 돋보기'
                : '더 나은 여행 코스를 탐색하는 돋보기'
            }
            resizeMode="contain"
            source={image as unknown as ImageSourcePropType}
          />
          <Heading>
            {isGenerating ? (
              <>
                {destination || '당신만을 위한 소도시'} 여행 코스를{`\n`}발굴 중이에요
              </>
            ) : (
              <>조금만 기다려주세요,{`\n`}더 나은 코스를 준비 중이에요</>
            )}
          </Heading>
          <Status accessibilityLiveRegion="polite">
            {isGenerating ? '숨겨진 명소 찾는 중...' : '새로운 동선을 그리고 있어요...'}
          </Status>
        </Screen>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.View({
  left: '50%',
  height: '100%',
  width: '100%',
  maxWidth: MAX_SCREEN_SIZE,
  transform: 'translateX(-50%);',
});

const Screen = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 32,
  backgroundColor: 'white',
});

const Illustration = styled.Image({ width: 231, height: 344, marginBottom: 32 });
const Heading = styled.Text({
  ...typography.heading4.semibold,
  color: colors.gray[1000],
  textAlign: 'center',
});
const Status = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
