import { type CalendarRange } from '@components/Calendar';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Animated, Platform } from 'react-native';
import { EditTripSpotCard } from '@components/EditTripSpotCard';
import {
  formatDate,
  getScheduleDates,
  recalculateCoursePlaces,
  type CoursePlaces,
  type CoursePlace,
} from './Routine';

interface CourseResultEditRoutineProps {
  title: string;
  period: CalendarRange;
  places: CoursePlaces;
  onTitleChange: (title: string) => void;
  onPlacesChange: (places: CoursePlaces) => void;
  onSchedulePress: () => void;
}

export function CourseResultEditRoutine({
  title,
  period,
  places,
  onTitleChange,
  onPlacesChange,
  onSchedulePress,
}: CourseResultEditRoutineProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    dayIndex: number;
    uid: string;
    name: string;
  } | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>();
  const [dragPreview, setDragPreview] = useState<{
    uid: string;
    fromIndex: number;
    toIndex: number;
  } | null>(null);
  const [dragCommitting, setDragCommitting] = useState(false);
  const scheduleDates = useMemo(() => getScheduleDates(period), [period]);

  useLayoutEffect(() => {
    if (!dragCommitting) return;

    const frame = requestAnimationFrame(() => setDragCommitting(false));
    return () => cancelAnimationFrame(frame);
  }, [dragCommitting]);

  const rows = useMemo<RoutineRow[]>(
    () =>
      scheduleDates.flatMap((date, dayIndex): RoutineRow[] => [
        { kind: 'date', key: `date:${date}`, date, dayIndex, height: dayIndex === 0 ? 49 : 73 },
        ...(places[dayIndex] ?? []).map((place): RoutineRow => ({
          kind: 'place',
          key: place.uid,
          place,
          dayIndex,
          height: 109,
        })),
      ]),
    [scheduleDates, places],
  );
  const getTargets = (fromIndex: number) => {
    const remaining = rows.filter((_, index) => index !== fromIndex);
    const origin = rows.slice(0, fromIndex).reduce((top, row) => top + row.height, 0);
    // The first date stays first. Every subsequent boundary is a valid insertion slot,
    // including between consecutive dates and after the final date of an empty day.
    return remaining.map((_, index) => ({
      index: index + 1,
      offset: remaining.slice(0, index + 1).reduce((top, row) => top + row.height, 0) - origin,
    }));
  };
  const shiftStep = (index: number) => {
    if (!dragPreview || index === dragPreview.fromIndex) return 0;
    const { fromIndex, toIndex } = dragPreview;
    if (fromIndex < index && index <= toIndex) return -1;
    if (toIndex <= index && index < fromIndex) return 1;
    return 0;
  };
  const reorderPlace = (fromIndex: number, offset: number) => {
    const target = getTargets(fromIndex).find((entry) => entry.offset === offset);
    if (!target || target.index === fromIndex) return;
    const nextRows = [...rows];
    const [movedRow] = nextRows.splice(fromIndex, 1);
    nextRows.splice(target.index, 0, movedRow);
    const nextDays: CoursePlaces = scheduleDates.map(() => []);
    let dayIndex = 0;
    for (const row of nextRows) {
      if (row.kind === 'date') {
        dayIndex = row.dayIndex;
      } else {
        nextDays[dayIndex].push({
          ...row.place,
          date: new Date(`${scheduleDates[dayIndex]}T00:00:00`),
        });
      }
    }
    onPlacesChange(recalculateCoursePlaces(nextDays));
  };

  const deletePlace = () => {
    if (!pendingDelete) return;
    const nextDays = places.map((day, dayIndex) =>
      dayIndex === pendingDelete.dayIndex
        ? day.filter((place) => place.uid !== pendingDelete.uid)
        : [...day],
    );
    onPlacesChange(recalculateCoursePlaces(nextDays));
    setPendingDelete(null);
  };

  return (
    <Section>
      <Heading>
        {isTitleEditing ? (
          <TitleInputContainer>
            <TitleInput
              autoFocus
              value={title}
              maxLength={30}
              onBlur={() => setIsTitleEditing(false)}
              onChangeText={onTitleChange}
              onSubmitEditing={() => setIsTitleEditing(false)}
              returnKeyType="done"
            />
            <ClearButton accessibilityRole="button" onPress={() => onTitleChange('')}>
              <IconComponent name="cancel" color="white" size={24} />
            </ClearButton>
          </TitleInputContainer>
        ) : (
          <>
            <Title>{title || '여행 코스 제목'}</Title>
            <EditButton
              accessibilityRole="button"
              accessibilityLabel="코스 제목 편집"
              onPress={() => setIsTitleEditing(true)}
            >
              <IconComponent name="pencil" color={colors.gray[400]} />
            </EditButton>
          </>
        )}
      </Heading>

      <List>
        {rows.map((row, index) =>
          row.kind === 'date' ? (
            <MovingDate key={row.key} shift={shiftStep(index) * 109} committing={dragCommitting}>
              <DateRow style={{ height: row.height, paddingTop: row.dayIndex === 0 ? 0 : 24 }}>
                <DayLabel>Day {row.dayIndex + 1}</DayLabel>
                <DateText>{formatDate(row.date)}</DateText>
                {row.dayIndex === 0 ? (
                  <ScheduleButton accessibilityRole="button" onPress={onSchedulePress}>
                    <ScheduleLabel>일정 변경</ScheduleLabel>
                  </ScheduleButton>
                ) : null}
              </DateRow>
            </MovingDate>
          ) : (
            <Item key={row.key} style={{ zIndex: dragPreview?.uid === row.key ? 10 : 0 }}>
              <CardSlot>
                <EditTripSpotCard
                  image={row.place.image}
                  name={row.place.name}
                  description={row.place.summary}
                  dropOffsets={getTargets(index).map((target) => target.offset)}
                  committing={dragCommitting}
                  shiftStep={shiftStep(index)}
                  onDelete={() => {
                    setPendingDelete({
                      dayIndex: row.dayIndex,
                      uid: row.key,
                      name: row.place.name,
                    });
                    setPendingDeleteName(row.place.name);
                  }}
                  onDrag={(offset) => {
                    const target = getTargets(index).find((entry) => entry.offset === offset);
                    if (target)
                      setDragPreview({ uid: row.key, fromIndex: index, toIndex: target.index });
                  }}
                  onDragCancel={() => setDragPreview(null)}
                  onDrop={(offset) => {
                    setDragCommitting(true);
                    reorderPlace(index, offset);
                    setDragPreview(null);
                  }}
                />
              </CardSlot>
            </Item>
          ),
        )}
      </List>
      <ConfirmModal
        confirmText="삭제"
        title="일정 삭제"
        visible={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={deletePlace}
      >
        <DeleteMessage>&quot;{pendingDeleteName}&quot; 일정을 삭제하시겠습니까?</DeleteMessage>
      </ConfirmModal>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 24,
});

const Heading = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const TitleInputContainer = styled.View({
  flex: 1,
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: colors.gray[25],
  borderRadius: 9999,
});

const TitleInput = styled.TextInput({
  flex: 1,
  minWidth: 0,
  paddingVertical: 0,
  ...typography.heading1.semibold,
  color: colors.gray[1000],

  ...Platform.select({
    web: { outlineStyle: 'none' as never, outlineWidth: 0 },
  }),
});

const ClearButton = styled.Pressable({
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
});

const EditButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled.Text({
  ...typography.heading1.semibold,
  color: colors.gray[1000],
});

const DateRow = styled.View({
  height: 49,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
});

const DayLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.gray[700],
});

const DateText = styled.Text({
  flex: 1,
  ...typography.body2.regular,
  color: colors.gray[500],
});

const ScheduleButton = styled.Pressable({
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});

const ScheduleLabel = styled.Text({
  ...typography.caption2.medium,
  color: colors.primary[900],
});

const List = styled.View({
  width: '100%',
  paddingBottom: 109,
});

const Item = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
});

const CardSlot = styled.View({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  paddingBottom: 16,
});

const DeleteMessage = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

type RoutineRow =
  | { kind: 'date'; key: string; date: string; dayIndex: number; height: number }
  | { kind: 'place'; key: string; place: CoursePlace; dayIndex: number; height: number };

function MovingDate({
  shift,
  committing,
  children,
}: React.PropsWithChildren<{ shift: number; committing: boolean }>) {
  const [translateY] = useState(() => new Animated.Value(0));
  useLayoutEffect(() => {
    if (Platform.OS === 'web' || committing) {
      translateY.stopAnimation();
      translateY.setValue(shift);
      return;
    }
    const animation = Animated.spring(translateY, {
      toValue: shift,
      damping: 24,
      stiffness: 280,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [shift, committing, translateY]);
  return (
    <AnimatedDate committing={committing} style={{ transform: [{ translateY }] }}>
      {children}
    </AnimatedDate>
  );
}

const AnimatedDate = styled(Animated.View)<{ committing: boolean }>(({ committing }) => ({
  width: '100%',
  ...Platform.select({
    web: {
      transitionDuration: committing ? '0ms' : '140ms',
      transitionProperty: 'transform',
      transitionTimingFunction: 'ease-out',
    },
  }),
}));
