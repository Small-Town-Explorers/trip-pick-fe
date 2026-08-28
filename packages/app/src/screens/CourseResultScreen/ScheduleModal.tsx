import { Calendar, type CalendarRange } from '@components/Calendar';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
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
    >
      {() => (
        <Content>
          <Calendar value={value} onChange={onChange} initialMonth={new Date(2026, 8, 1)} />
          <Period>{formatPeriod(value)}</Period>
        </Content>
      )}
    </BottomSheetModal>
  );
}

const Content = styled.View({
  width: '100%',
  paddingTop: 16,
  paddingHorizontal: 20,
  paddingBottom: Platform.OS === 'web' ? 96 : 34,
  gap: 16,
});
const Period = styled.Text({ ...typography.body1.medium, color: colors.primary[700] });
