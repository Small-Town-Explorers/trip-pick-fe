import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { OptionGrid, type CourseOption } from './OptionGrid';

const styleOptions: readonly CourseOption[] = [
  { label: '알차게' },
  { label: '보통' },
  { label: '여유롭게' },
];

interface CourseCreateDensityProps {
  value: string;
  onChange: (density: string) => void;
}

export function CourseCreateDensity({ value, onChange }: CourseCreateDensityProps) {
  const toggleDensity = (density: string) => onChange(value === density ? '' : density);

  return (
    <Section>
      <Title>
        <TitleText>코스 밀도</TitleText>
        <TitleSub>{value}</TitleSub>
      </Title>
      <OptionGrid
        options={styleOptions}
        columns={3}
        selected={[value]}

        onSelect={toggleDensity}
      />
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
