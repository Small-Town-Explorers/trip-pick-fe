import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { shareTextTemplate } from '@react-native-kakao/share';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import type { CalendarRange } from '../../components/Calendar';
import { createCourseShareUrl } from '../../sharing';
import type { CoursePlaces } from './Routine';

interface CourseResultShareModalProps {
  visible: boolean;
  title: string;
  period: CalendarRange;
  places: CoursePlaces;
  onClose: () => void;
}

export function CourseResultShareModal({
  visible,
  title,
  period,
  places,
  onClose,
}: CourseResultShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState('');
  const shareUrlResult = useMemo(() => {
    try {
      return { url: createCourseShareUrl(title, period, places), error: '' };
    } catch (error) {
      return {
        url: '',
        error: error instanceof Error ? error.message : '공유 링크를 만들지 못했어요.',
      };
    }
  }, [period, places, title]);
  const displayedError = shareError || shareUrlResult.error;
  const closeModal = () => {
    setShareError('');
    onClose();
  };

  const shareCourse = async () => {
    if (!shareUrlResult.url || isSharing) return;
    setIsSharing(true);
    setShareError('');

    try {
      await shareTextTemplate({
        template: {
          text: `${title.trim() || '여행 코스'} 여행 코스를 확인해 보세요.`,
          link: { webUrl: shareUrlResult.url, mobileWebUrl: shareUrlResult.url },
          buttons: [
            {
              title: '코스 확인하기',
              link: { webUrl: shareUrlResult.url, mobileWebUrl: shareUrlResult.url },
            },
          ],
        },
        useWebBrowserIfKakaoTalkNotAvailable: true,
      });
      closeModal();
    } catch (error) {
      setShareError(error instanceof Error ? error.message : '카카오톡 공유를 시작하지 못했어요.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Backdrop accessibilityRole="button" accessibilityLabel="공유 창 닫기" onPress={closeModal}>
        <Dialog accessibilityRole="alert" onPress={(event) => event.stopPropagation()}>
          <Title>여행 코스 내보내기</Title>
          <KakaoTalkButton
            accessibilityRole="button"
            disabled={isSharing || !shareUrlResult.url}
            onPress={() => void shareCourse()}
          >
            {isSharing ? <ActivityIndicator color="#FFFFFF" /> : <IconComponent name="kakao" />}
            <LightLabel>{isSharing ? '카카오톡 여는 중' : '카카오톡 공유하기'}</LightLabel>
          </KakaoTalkButton>
          {displayedError ? <ErrorText>{displayedError}</ErrorText> : null}
          <CancelButton accessibilityRole="button" onPress={closeModal}>
            <CancelLabel>취소</CancelLabel>
          </CancelButton>
        </Dialog>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled.Pressable({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  backgroundColor: withAlpha(colors.gray[300], 0.3),
});

const Dialog = styled.Pressable({
  width: 300,
  maxWidth: '100%',
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...createShadow(0, 0, 28, 0, withAlpha(colors.gray[1000], 0.1)),
});

const Title = styled.Text({
  paddingVertical: 8,
  ...typography.body1.semibold,
  color: colors.gray[1000],
  textAlign: 'center',
});

const ShareButton = styled.Pressable({
  width: '100%',
  height: 44,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 8,
});

const KakaoTalkButton = styled(ShareButton)({ backgroundColor: colors.gray[900] });
const CancelButton = styled(ShareButton)({ backgroundColor: colors.primary[50] });
const LightLabel = styled.Text({ ...typography.body2.semibold, color: '#FFFFFF' });
const CancelLabel = styled.Text({ ...typography.body2.semibold, color: colors.primary[800] });
const ErrorText = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
