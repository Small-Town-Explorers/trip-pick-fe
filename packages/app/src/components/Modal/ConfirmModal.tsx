import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { type PropsWithChildren } from 'react';
import { Modal, Platform } from 'react-native';

type ConfirmModalProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  cancelText?: string;
  confirmText?: string;
  width?: number;
  onClose?: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}>;

export function ConfirmModal({
  visible,
  title,
  children,
  cancelText = '취소',
  confirmText = '확인',
  width = 300,
  onCancel,
  onClose = onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Backdrop accessibilityRole="button" accessibilityLabel="모달 닫기" onPress={onClose}>
        <Dialog width={width} accessibilityRole="alert" onPress={(event) => event.stopPropagation()}>
          <Content>
            <Title>{title}</Title>
            <Body>{children}</Body>
          </Content>

          <Actions>
            <CancelButton accessibilityRole="button" onPress={onCancel}>
              <CancelLabel>{cancelText}</CancelLabel>
            </CancelButton>
            <ConfirmButton accessibilityRole="button" onPress={onConfirm}>
              <ConfirmLabel>{confirmText}</ConfirmLabel>
            </ConfirmButton>
          </Actions>
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
  backgroundColor: 'rgba(181, 186, 187, 0.30)',
});

const Dialog = styled.Pressable<{ width: number }>(({ width }) => ({
  width,
  maxWidth: '100%',
  padding: 20,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,

  ...Platform.select({
    web: {
      boxShadow: '0 0 28px rgba(8, 25, 29, 0.1)',
    },
    ios: {
      shadowColor: '#08191D',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
    },
    android: {
      elevation: 8,
      shadowColor: '#08191D',
    },
  }),
}));

const Content = styled.View({
  width: '100%',
  paddingVertical: 8,
  gap: 12,
});

const Title = styled.Text({
  ...typography.body1.semibold,
  color: colors.gray[1000],
  textAlign: 'center',
});

const Body = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Actions = styled.View({
  width: '100%',
  height: 44,
  flexDirection: 'row',
  gap: 12,
});

const CancelButton = styled.Pressable({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary[50],
  borderRadius: 8,
});

const ConfirmButton = styled.Pressable({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary[600],
  borderRadius: 8,
});

const CancelLabel = styled.Text({
  ...typography.body2.semibold,
  color: colors.primary[800],
});

const ConfirmLabel = styled.Text({
  ...typography.body2.semibold,
  color: '#FFFFFF',
});
