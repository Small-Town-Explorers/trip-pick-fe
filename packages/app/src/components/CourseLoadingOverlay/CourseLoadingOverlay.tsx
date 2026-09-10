import CourseGeneratingImage from '@assets/images/course_generating.png';
import CourseRegeneratingImage from '@assets/images/course_regenerating.png';
import styled from '@emotion/native';
import { colors, MAX_SCREEN_SIZE, typography } from '@styles';
import { useCallback, useEffect, useRef } from 'react';
import { Modal, Platform, type ImageSourcePropType } from 'react-native';
import { RotatingStatus } from './RotatingStatus';

interface CourseLoadingOverlayProps {
  visible: boolean;
  mode: 'generate' | 'regenerate';
  destination?: string;
  completed?: boolean;
  autoCompleteAfterMs?: number;
  onCancel: () => void;
  onComplete: () => void;
}

const GENERATING_STATUS_MESSAGES = [
  '숨겨진 소도시를 발굴하는 중…',
  '현지인만 아는 명소를 찾는 중…',
  '골목골목을 둘러보는 중…',
  '특별한 여행지를 탐색하는 중…',
  '아직 많이 알려지지 않은 스팟을 찾는 중…',
  '여행의 보석 같은 장소를 찾는 중…',
  '지도 밖의 매력을 발견하는 중…',
  '숨겨진 비밀 맛집을 찾는 중…',
  '현지인이 추천하는 맛집을 찾는 중…',
  '줄 서서 먹는 맛집을 탐색하는 중…',
  '여행의 한 끼를 고민하는 중…',
  '오래 기억될 맛집을 찾는 중…',
  '로컬 맛집을 수집하는 중…',
  '감성 카페를 찾아다니는 중…',
  '사진 찍기 좋은 장소를 찾는 중…',
  '인생샷 명소를 탐색하는 중…',
  '분위기 좋은 장소를 발견하는 중…',
  '감성 가득한 공간을 찾는 중…',
  '조용한 힐링 스팟을 찾는 중…',
  '아름다운 풍경을 담는 중…',
  '산책하기 좋은 곳을 찾는 중…',
  '자연 속 쉼터를 탐색하는 중…',
  '여유를 즐길 장소를 찾는 중…',
  'AI가 여행 코스를 조합하는 중…',
  '여행 데이터를 분석하는 중…',
  '가장 어울리는 스팟을 고르는 중…',
  '숨은 명소를 선별하는 중…',
  '여행 취향을 분석하는 중…',
  '최고의 조합을 만드는 중…',
  '특별한 코스를 완성하는 중…',
  '여행 고수에게 물어보는 중…',
  '현지 주민을 몰래 따라가는 중…',
  '발품 대신 AI가 뛰는 중…',
  '길 잃은 여행자를 구하는 중…',
  '오늘의 숨은 보물을 찾는 중…',
  '여행 버킷리스트를 채우는 중…',
  '지도에 별표를 찍는 중…',
  '여행 설렘을 모으는 중…',
] as const;

const REGENERATING_STATUS_MESSAGES = [
  '새로운 동선을 그리고 있어요...',
  '더 어울리는 장소를 찾는 중...',
  '여행 순서를 다시 맞추는 중...',
  '코스를 더 알차게 다듬는 중...',
] as const;

export function CourseLoadingOverlay({
  visible,
  mode,
  destination,
  completed = false,
  autoCompleteAfterMs,
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

    const timer =
      autoCompleteAfterMs === undefined ? undefined : setTimeout(complete, autoCompleteAfterMs);
    return () => {
      if (timer) clearTimeout(timer);
      pendingLeave.current = null;
      removeHistoryListener();
    };
  }, [autoCompleteAfterMs, complete, removeHistoryListener, visible]);

  useEffect(() => {
    if (visible && completed) complete();
  }, [complete, completed, visible]);

  const isGenerating = mode === 'generate';
  const image = isGenerating ? CourseGeneratingImage : CourseRegeneratingImage;
  const statusMessages = isGenerating ? GENERATING_STATUS_MESSAGES : REGENERATING_STATUS_MESSAGES;

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
          <RotatingStatus key={`${mode}-${visible}`} messages={statusMessages} visible={visible} />
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
