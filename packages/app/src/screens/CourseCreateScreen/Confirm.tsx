import { type CalendarRange } from '@components/Calendar';
import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

interface CourseCreateConfirmProps {
  visible: boolean;
  region: string;
  density: string;
  styles: string[];
  companion: string;
  period: CalendarRange;
  onCancel: () => void;
  onConfirm: () => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';

  const [year, month, date] = dateString.split('-').map(Number);
  return `${year}.${month}.${date}`;
};

const formatPeriod = ({ startDate, endDate }: CalendarRange) => {
  if (!startDate) return '';
  if (!endDate) return formatDate(startDate);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export function CourseCreateConfirm({
  visible,
  region,
  density,
  styles,
  companion,
  period,
  onCancel,
  onConfirm,
}: CourseCreateConfirmProps) {
  return (
    <ConfirmModal
      visible={visible}
      title="여행 코스를 생성하겠습니다."
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Summary>
        <SummaryLine>
          지역 : <Highlight>{region || '선택 안 함'}</Highlight>
        </SummaryLine>
        {density ? (
          <SummaryLine>
            코스 밀도 : <Highlight>{density || '선택 안 함'}</Highlight>
          </SummaryLine>
        ) : null}
        {styles.length > 0 ? (
          <SummaryLine>
            여행 스타일 : <Highlight>{styles.join(', ') || '선택 안 함'}</Highlight>
          </SummaryLine>
        ) : null}
        {companion ? (
          <SummaryLine>
            동행 인원 : <Highlight>{companion || '선택 안 함'}</Highlight>
          </SummaryLine>
        ) : null}
        {period.startDate ? (
          <SummaryLine>
            여행 기간 : <Highlight>{formatPeriod(period) || '선택 안 함'}</Highlight>
          </SummaryLine>
        ) : null}
      </Summary>
    </ConfirmModal>
  );
}

const Summary = styled.View({
  width: '100%',
  alignItems: 'center',
});

const SummaryLine = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const Highlight = styled.Text({
  color: colors.primary[600],
});
