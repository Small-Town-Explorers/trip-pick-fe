import { Calendar, type CalendarRange } from '@components/Calendar';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const formatDate = (dateString: string) => {
  const [year, month, date] = dateString.split('-').map(Number);
  const day = weekdays[new Date(year, month - 1, date).getDay()];

  return `${year}.${month}.${date}(${day})`;
};

const formatPeriod = ({ startDate, endDate }: CalendarRange) => {
  if (!startDate) return '';
  if (!endDate) return formatDate(startDate);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

interface CourseCreateTravelPeriodProps {
  value: CalendarRange;
  onChange: (period: CalendarRange) => void;
}

export function CourseCreateTravelPeriod({ value, onChange }: CourseCreateTravelPeriodProps) {
  const periodText = formatPeriod(value);

  return (
    <Section>
      <Title>
        <TitleText>여행 기간</TitleText>
        <TitleSub>{periodText}</TitleSub>
      </Title>
      <Calendar value={value} onChange={onChange} />
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 12,
});

const Title = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
});

const TitleText = styled.Text({
  flexShrink: 0,
  ...typography.body1.medium,
  color: colors.gray[1000],
});

const TitleSub = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[700],
});
