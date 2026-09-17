import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { shareFeedTemplate } from '@react-native-kakao/share';
import { colors, createShadow, typography, withAlpha } from '@styles';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { useEnableCourseShareMutation, useMyPageSummaryQuery } from '../../queries';
import { createCourseShareUrl } from '../../sharing';

interface CourseResultShareModalProps {
  visible: boolean;
  title: string;
  courseId?: string;
  onClose: () => void;
}

export function CourseResultShareModal({
  visible,
  title,
  courseId,
  onClose,
}: CourseResultShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [shareError, setShareError] = useState('');
  const { data: myPageSummary } = useMyPageSummaryQuery(visible);
  const enableShareMutation = useEnableCourseShareMutation();
  const { data: share, error: issueError, isPending, mutate, reset } = enableShareMutation;
  const shareUrl = share && share.courseId === courseId ? createCourseShareUrl(share.shareId) : '';
  const displayedError =
    shareError ||
    (!courseId
      ? '코스를 저장한 뒤 공유할 수 있어요.'
      : issueError instanceof Error
        ? issueError.message
        : '');

  useEffect(() => {
    if (!visible) return;
    reset();
    if (courseId) mutate(courseId);
  }, [courseId, mutate, reset, visible]);

  const closeModal = () => {
    setCopiedUrl('');
    setShareError('');
    onClose();
  };

  const shareCourse = async () => {
    if (!share || !shareUrl || isSharing) return;
    setIsSharing(true);
    setShareError('');

    try {
      const courseTitle = (title.trim() || '여행 코스').slice(0, 100);
      const sharerName = (myPageSummary?.nickname.trim() || '사용자').slice(0, 30);
      const executionParams = { shareId: share.shareId };
      const link = {
        webUrl: shareUrl,
        mobileWebUrl: shareUrl,
        androidExecutionParams: executionParams,
        iosExecutionParams: executionParams,
      };

      await shareFeedTemplate({
        template: {
          content: {
            title: `'${sharerName}'님이 생성한 '${courseTitle}' 여행 코스를 확인해보세요.`,
            imageUrl: new URL('/logo_button.png', shareUrl).toString(),
            imageWidth: 111,
            imageHeight: 111,
            link,
          },
          buttons: [
            {
              title: '코스 확인하기',
              link,
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

  const copyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await Clipboard.setStringAsync(shareUrl);
      setCopiedUrl(shareUrl);
    } catch {
      setShareError('링크를 복사하지 못했어요. 다시 시도해 주세요.');
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
          ) : displayedError ? (
            <ErrorText>{displayedError}</ErrorText>
          ) : (
            <>
              <LinkField accessibilityLabel="공유 링크" editable={false} value={shareUrl} />
              <CopyButton accessibilityRole="button" onPress={() => void copyShareUrl()}>
                <IconComponent name="share" color="#FFFFFF" />
                <LightLabel>
                  {copiedUrl === shareUrl ? '링크를 복사했어요' : '링크 복사하기'}
                </LightLabel>
              </CopyButton>
              <KakaoTalkButton
                accessibilityRole="button"
                disabled={isSharing || !shareUrl}
                onPress={() => void shareCourse()}
              >
                {isSharing ? <ActivityIndicator color="#FFFFFF" /> : <IconComponent name="kakao" />}
                <LightLabel>{isSharing ? '카카오톡 여는 중' : '카카오톡 공유하기'}</LightLabel>
              </KakaoTalkButton>
            </>
          )}
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
const KakaoTalkButton = styled(ShareButton)({ backgroundColor: colors.gray[900] });
const CancelButton = styled(ShareButton)({ backgroundColor: colors.primary[50] });
const LightLabel = styled.Text({ ...typography.body2.semibold, color: '#FFFFFF' });
const CancelLabel = styled.Text({ ...typography.body2.semibold, color: colors.primary[800] });
const ErrorText = styled.Text({
  ...typography.caption1.regular,
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
