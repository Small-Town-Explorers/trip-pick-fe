import KakaoMapIcon from '@assets/images/kakao_map.png';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { Linking, Modal, Platform, Share, type ImageSourcePropType } from 'react-native';

interface CourseResultShareModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function CourseResultShareModal({ visible, title, onClose }: CourseResultShareModalProps) {
  const openKakaoMap = () => Linking.openURL('https://map.kakao.com/');
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
          <KakaoMapButton accessibilityRole="button" onPress={openKakaoMap}>
            <KakaoMapImage
              source={KakaoMapIcon as unknown as ImageSourcePropType}
              accessibilityLabel="카카오맵"
            />
            <DarkLabel>카카오맵 경로 보기</DarkLabel>
          </KakaoMapButton>
          <KakaoTalkButton accessibilityRole="button" onPress={shareCourse}>
            <TalkIcon>
              <TalkTail />
            </TalkIcon>
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
  backgroundColor: 'rgba(181, 186, 187, 0.3)',
});

const Dialog = styled.Pressable({
  width: 300,
  maxWidth: '100%',
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,

  ...Platform.select({
    web: { boxShadow: '0 0 28px rgba(8, 25, 29, 0.1)' },
    ios: {
      shadowColor: '#08191D',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
    },
    android: { elevation: 8, shadowColor: '#08191D' },
  }),
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

const KakaoMapButton = styled(ShareButton)({ backgroundColor: '#F8DF00' });
const KakaoTalkButton = styled(ShareButton)({ backgroundColor: colors.gray[900] });
const CancelButton = styled(ShareButton)({ backgroundColor: colors.primary[50] });

const KakaoMapImage = styled.Image({ width: 20, height: 20, borderRadius: 9999 });

const TalkIcon = styled.View({
  width: 19,
  height: 16,
  backgroundColor: '#FAE301',
  borderRadius: 9999,
});

const TalkTail = styled.View({
  position: 'absolute',
  left: 3,
  bottom: -3,
  width: 5,
  height: 5,
  backgroundColor: '#FAE301',
  transform: [{ rotate: '35deg' }],
});

const DarkLabel = styled.Text({ ...typography.body2.semibold, color: '#1E1E1E' });
const LightLabel = styled.Text({ ...typography.body2.semibold, color: '#FFFFFF' });
const CancelLabel = styled.Text({ ...typography.body2.semibold, color: colors.primary[800] });
