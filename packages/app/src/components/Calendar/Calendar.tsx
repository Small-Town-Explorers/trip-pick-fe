import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useMemo, useState } from 'react';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export interface CalendarRange {
  startDate?: string;
  endDate?: string;
}

interface CalendarProps {
  value: CalendarRange;
  onChange: (range: CalendarRange) => void;
  initialMonth?: Date;
  minMonth?: Date;
}

interface CalendarDate {
  key: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

const formatDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const getCalendarDates = (monthDate: Date): CalendarDate[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + lastDay) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - firstWeekday + 1);
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const day = date.getDate();

    return {
      key: formatDateKey(dateYear, dateMonth, day),
      day,
      month: dateMonth,
      year: dateYear,
      isCurrentMonth: dateMonth === month,
    };
  });
};

export function Calendar({
  value,
  onChange,
  initialMonth = new Date(),
  minMonth = new Date(),
}: CalendarProps) {
  const minimumMonth = new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
  const [monthDate, setMonthDate] = useState(
    () => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  );
  const dates = useMemo(() => getCalendarDates(monthDate), [monthDate]);
  const isPreviousMonthDisabled = monthDate.getTime() <= minimumMonth.getTime();

  const moveMonth = (offset: number) => {
    setMonthDate(
      (currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  const selectDate = (dateKey: string) => {
    if (!value.startDate || value.endDate) {
      onChange({ startDate: dateKey });
      return;
    }

    if (dateKey === value.startDate) {
      onChange({});
      return;
    }

    onChange(
      dateKey < value.startDate
        ? { startDate: dateKey, endDate: value.startDate }
        : { startDate: value.startDate, endDate: dateKey },
    );
  };

  return (
    <Container>
      <MonthHeader>
        <MonthButton
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          accessibilityState={{ disabled: isPreviousMonthDisabled }}
          disabled={isPreviousMonthDisabled}
          onPress={() => moveMonth(-1)}
        >
          <IconComponent
            name="carousel_left"
            color={isPreviousMonthDisabled ? colors.gray[100] : colors.gray[500]}
            size={16}
          />
        </MonthButton>
        <MonthLabel>
          {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
        </MonthLabel>
        <MonthButton
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          onPress={() => moveMonth(1)}
        >
          <IconComponent name="carousel_right" color={colors.gray[500]} size={16} />
        </MonthButton>
      </MonthHeader>

      <WeekdayRow>
        {weekdays.map((weekday) => (
          <Weekday key={weekday}>{weekday}</Weekday>
        ))}
      </WeekdayRow>

      <DateGrid>
        {dates.map((date) => {
          const isStart = date.key === value.startDate;
          const isEnd = date.key === value.endDate || (isStart && !value.endDate);
          const isInRange = Boolean(
            value.startDate &&
            value.endDate &&
            date.key > value.startDate &&
            date.key < value.endDate,
          );
          const isSelected = isStart || isEnd || isInRange;

          return (
            <DateButton
              key={date.key}
              accessibilityRole="button"
              accessibilityLabel={`${date.year}년 ${date.month + 1}월 ${date.day}일`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => selectDate(date.key)}
            >
              <DateLabelContainer isSelected={isSelected} isStart={isStart} isEnd={isEnd}>
                <DateLabel isCurrentMonth={date.isCurrentMonth} isSelected={isSelected}>
                  {date.day}
                </DateLabel>
              </DateLabelContainer>
            </DateButton>
          );
        })}
      </DateGrid>
    </Container>
  );
}

const Container = styled.View({
  width: '100%',
  padding: 16,
  backgroundColor: colors.gray[25],
  borderRadius: 16,
});

const MonthHeader = styled.View({
  width: '100%',
  height: 40,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
});

const MonthButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});

const MonthLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[1000],
});

const WeekdayRow = styled.View({
  width: '100%',
  height: 52,
  flexDirection: 'row',
  alignItems: 'center',
});

const Weekday = styled.Text({
  flex: 1,
  ...typography.body2.regular,
  color: colors.gray[700],
  textAlign: 'center',
});

const DateGrid = styled.View({
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const DateButton = styled.Pressable({
  width: `${100 / 7}%`,
  height: 52,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 4,
});

const DateLabelContainer = styled.View<{
  isSelected: boolean;
  isStart: boolean;
  isEnd: boolean;
}>(({ isSelected, isStart, isEnd }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isSelected ? colors.primary[600] : 'transparent',
  borderTopLeftRadius: isSelected && isStart ? 9999 : 0,
  borderBottomLeftRadius: isSelected && isStart ? 9999 : 0,
  borderTopRightRadius: isSelected && isEnd ? 9999 : 0,
  borderBottomRightRadius: isSelected && isEnd ? 9999 : 0,
}));

const DateLabel = styled.Text<{ isCurrentMonth: boolean; isSelected: boolean }>(
  ({ isCurrentMonth, isSelected }) => ({
    ...typography.body2.medium,
    color: isSelected ? '#FFFFFF' : isCurrentMonth ? colors.gray[1000] : colors.gray[200],
    textAlign: 'center',
  }),
);
