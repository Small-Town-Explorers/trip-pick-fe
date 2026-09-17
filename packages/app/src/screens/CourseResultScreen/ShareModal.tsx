import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { useEnableCourseShareMutation } from '../../queries';
import { createCourseShareUrl } from '../../sharing';

interface CourseResultShareModalProps {
  visible: boolean;
  title: string;
  courseId?: string;
  onClose: () => void;
}

export function CourseResultShareModal({
  visible,
  courseId,
  onClose,
}: CourseResultShareModalProps) {
  const [copiedUrl, setCopiedUrl] = useState('');
  const enableShareMutation = useEnableCourseShareMutation();
  const { data: share, error: shareError, isPending, mutate, reset } = enableShareMutation;
  const shareUrl = share && share.courseId === courseId ? createCourseShareUrl(share.shareId) : '';
  const error = !courseId
    ? '코스를 저장한 뒤 공유할 수 있어요.'
    : shareError instanceof Error
      ? shareError.message
      : '';

  useEffect(() => {
    if (!visible) return;
    reset();
    if (courseId) mutate(courseId);
  }, [courseId, mutate, reset, visible]);

  const copied = copiedUrl === shareUrl;
  const closeModal = () => {
    setCopiedUrl('');
    onClose();
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(shareUrl);
    } catch {
      const input = document.createElement('textarea');
      input.value = shareUrl;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      const copiedWithFallback = document.execCommand('copy');
      input.remove();
      setCopiedUrl(copiedWithFallback ? shareUrl : '');
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
          {isPending ? (
            <LoadingState>
              <ActivityIndicator color={colors.primary[700]} />
              <LoadingText>공유 링크를 만들고 있어요.</LoadingText>
            </LoadingState>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : (
            <>
              <LinkField accessibilityLabel="공유 링크" editable={false} value={shareUrl} />
              <CopyButton accessibilityRole="button" onPress={() => void copyShareUrl()}>
                <IconComponent name="share" color="#FFFFFF" />
                <LightLabel>{copied ? '링크를 복사했어요' : '링크 복사하기'}</LightLabel>
              </CopyButton>
            </>
          )}
          <CancelButton accessibilityRole="button" onPress={closeModal}>
            <CancelLabel>닫기</CancelLabel>
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
  width: 360,
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

const LinkField = styled.TextInput({
  width: '100%',
  height: 44,
  paddingHorizontal: 12,
  ...typography.caption1.regular,
  color: colors.gray[700],
  backgroundColor: colors.gray[50],
  borderRadius: 8,
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

const CopyButton = styled(ShareButton)({ backgroundColor: colors.gray[900] });
const CancelButton = styled(ShareButton)({ backgroundColor: colors.primary[50] });
const LightLabel = styled.Text({ ...typography.body2.semibold, color: '#FFFFFF' });
const CancelLabel = styled.Text({ ...typography.body2.semibold, color: colors.primary[800] });
const ErrorText = styled.Text({
  paddingVertical: 12,
  ...typography.body2.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
const LoadingState = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  gap: 8,
});
const LoadingText = styled.Text({ ...typography.body2.regular, color: colors.gray[600] });
