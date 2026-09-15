import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { Modal, Share } from 'react-native';

interface CourseResultShareModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function CourseResultShareModal({ visible, title, onClose }: CourseResultShareModalProps) {
  const shareCourse = () => Share.share({ message: `${title} 여행 코스를 확인해 보세요.` });

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Backdrop accessibilityRole="button" accessibilityLabel="공유 창 닫기" onPress={onClose}>
        <Dialog accessibilityRole="alert" onPress={(event) => event.stopPropagation()}>
          <Title>여행 코스 내보내기</Title>
          <KakaoTalkButton accessibilityRole="button" onPress={shareCourse}>
            <IconComponent name="kakao" />
            <LightLabel>카카오톡 공유하기</LightLabel>
          </KakaoTalkButton>
          <CancelButton accessibilityRole="button" onPress={onClose}>
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
  height: 40,
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
