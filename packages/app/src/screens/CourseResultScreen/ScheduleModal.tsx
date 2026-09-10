import { Calendar, type CalendarRange } from '@components/Calendar';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { Platform } from 'react-native';

interface CourseResultScheduleModalProps {
  visible: boolean;
  value: CalendarRange;
  onChange: (period: CalendarRange) => void;
  onClose: () => void;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const [year, month, date] = dateString.split('-').map(Number);
  const weekday = weekdays[new Date(year, month - 1, date).getDay()];
  return `${year}.${month}.${date}(${weekday})`;
};

const formatPeriod = ({ startDate, endDate }: CalendarRange) =>
  [formatDate(startDate), formatDate(endDate)].filter(Boolean).join(' - ');

interface ScheduleEditorProps {
  initialPeriod: CalendarRange;
  onCancel: () => void;
  onSave: (period: CalendarRange) => void;
}

function ScheduleEditor({ initialPeriod, onCancel, onSave }: ScheduleEditorProps) {
  const [draftPeriod, setDraftPeriod] = useState<CalendarRange>(initialPeriod);
  const canSave = Boolean(draftPeriod.startDate);

  return (
    <Content>
      <Calendar value={draftPeriod} onChange={setDraftPeriod} initialMonth={new Date(2026, 8, 1)} />
      <Period>{formatPeriod(draftPeriod)}</Period>
      <Actions>
        <CancelButton accessibilityRole="button" onPress={onCancel}>
          <CancelButtonText>취소</CancelButtonText>
        </CancelButton>
        <SaveButton
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          disabled={!canSave}
          onPress={() => onSave(draftPeriod)}
        >
          <SaveButtonText disabled={!canSave}>저장</SaveButtonText>
        </SaveButton>
      </Actions>
    </Content>
  );
}

export function CourseResultScheduleModal({
  visible,
  value,
  onChange,
  onClose,
}: CourseResultScheduleModalProps) {
  return (
    <BottomSheetModal
      title="여행 일정 변경"
      accessibilityLabel="일정 변경 닫기"
      visible={visible}
      onClose={onClose}
      baseHeight={640}
      isExpandable={false}
    >
      {({ close }) => (
        <ScheduleEditor
          initialPeriod={value}
          onCancel={close}
          onSave={(period) => {
            onChange(period);
            close();
          }}
        />
      )}
    </BottomSheetModal>
  );
}

const Content = styled.View({
  flex: 1,
  width: '100%',
  paddingTop: 16,
  paddingHorizontal: 20,
  paddingBottom: Platform.OS === 'web' ? 96 : 34,
  gap: 24,
});
const Period = styled.Text({ ...typography.body1.medium, color: colors.primary[700] });

const Actions = styled.View({
  width: '100%',
  height: 48,
  flexDirection: 'row',
  gap: 12,
});

const CancelButton = styled.Pressable({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: colors.primary[50],
});

const CancelButtonText = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[700],
});

const SaveButton = styled.Pressable<{ disabled: boolean }>(({ disabled }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: disabled ? colors.primary[200] : colors.primary[600],
}));

const SaveButtonText = styled.Text<{ disabled: boolean }>(({ disabled }) => ({
  ...typography.body2.medium,
  color: disabled ? colors.gray[100] : '#FFFFFF',
}));
