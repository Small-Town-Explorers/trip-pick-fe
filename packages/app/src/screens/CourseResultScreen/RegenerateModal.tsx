import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

interface CourseResultRegenerateModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CourseResultRegenerateModal({
  visible,
  onCancel,
  onConfirm,
}: CourseResultRegenerateModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      title="코스 다시 생성"
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Description>코스를 다시 생성하시겠습니까?</Description>
    </ConfirmModal>
  );
}

const Description = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
