import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

interface HomeSaveCompleteModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onView: () => void;
}

export function HomeSaveCompleteModal({
  title,
  visible,
  onClose,
  onView,
}: HomeSaveCompleteModalProps) {
  return (
    <ConfirmModal
      cancelText="보러가기 →"
      confirmText="확인"
      title="코스 저장 완료"
      visible={visible}
      onCancel={onView}
      onClose={onClose}
      onConfirm={onClose}
    >
      <Message>
        &apos;{title}&apos; 코스가{`\n`}저장되었습니다.
      </Message>
    </ConfirmModal>
  );
}

const Message = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
