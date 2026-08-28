import { IconComponent, type IconName } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

export type CourseOption = {
  label: string;
  icon?:
    | string
    | {
        name: IconName;
        color?: string;
      };
};

type Props = {
  options: readonly CourseOption[];
  columns: number;
  selected: readonly string[];
  enabled?: boolean;
  vertical?: boolean;
  onSelect: (label: string) => void;
};

export function OptionGrid({
  options,
  columns,
  selected,
  vertical = false,
  enabled = true,
  onSelect,
}: Props) {
  const rows = Array.from({ length: Math.ceil(options.length / columns) }, (_, rowIndex) =>
    options.slice(rowIndex * columns, (rowIndex + 1) * columns),
  );

  return (
    <Grid>
      {rows.map((row, rowIndex) => (
        <Row key={row.map((option) => option.label).join('-')}>
          {row.map((option) => (
            <OptionButton
              key={option.label}
              accessibilityRole="button"
              accessibilityState={{
                selected: selected.includes(option.label),
                disabled: !enabled,
              }}
              isSelected={selected.includes(option.label)}
              isVertical={vertical}
              onPress={() => onSelect(option.label)}
              disabled={!enabled}
            >
              {typeof option.icon === 'string' && <OptionIcon>{option.icon}</OptionIcon>}
              {option.icon && typeof option.icon !== 'string' && (
                <IconComponent
                  name={option.icon.name}
                  color={
                    enabled
                      ? selected.includes(option.label)
                        ? 'white'
                        : option.icon.color
                      : colors.gray[200]
                  }
                />
              )}
              <OptionLabel isSelected={selected.includes(option.label)} isDisabled={!enabled}>
                {option.label}
              </OptionLabel>
            </OptionButton>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }, (_, emptyIndex) => (
              <EmptyOption key={`${rowIndex}-${emptyIndex}`} />
            ))}
        </Row>
      ))}
    </Grid>
  );
}

const Grid = styled.View({
  width: '100%',
  gap: 12,
});

const Row = styled.View({
  width: '100%',
  flexDirection: 'row',
  gap: 12,
});

const OptionButton = styled.Pressable<{ isSelected: boolean; isVertical: boolean }>(
  ({ isSelected, isVertical }) => ({
    flex: 1,
    minWidth: 0,
    height: isVertical ? 84 : 42,
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 6,
    backgroundColor: isSelected ? colors.primary[600] : colors.gray[25],
    borderRadius: 8,
  }),
);

const OptionIcon = styled.Text({
  fontSize: 22,
  lineHeight: 24,
});

const OptionLabel = styled.Text<{ isSelected: boolean; isDisabled: boolean }>(
  ({ isSelected, isDisabled }) => ({
    ...typography.body2.regular,
    color: isDisabled ? colors.gray[300] : isSelected ? 'white' : colors.gray[800],
    textAlign: 'center',
  }),
);

const EmptyOption = styled.View({
  flex: 1,
});
