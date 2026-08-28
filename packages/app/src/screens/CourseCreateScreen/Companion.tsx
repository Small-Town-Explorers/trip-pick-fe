import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { OptionGrid, type CourseOption } from './OptionGrid';

const companionOptions: readonly CourseOption[] = [
  { label: '혼자' },
  { label: '친구' },
  { label: '연인 · 배우자' },
  { label: '아이' },
  { label: '부모님' },
  { label: '그외' },
];

interface CourseCreateCompanionProps {
  value: string;
  onChange: (companion: string) => void;
}

export function CourseCreateCompanion({ value, onChange }: CourseCreateCompanionProps) {
  return (
    <Section>
      <Title>
        <TitleText>누구와 떠나시나요?</TitleText>
        <TitleSub>{value}</TitleSub>
      </Title>
      <OptionGrid
        options={companionOptions}
        columns={3}
        selected={value ? [value] : []}
        onSelect={onChange}
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
});

const TitleText = styled.Text({
  ...typography.body1.medium,
  color: colors.gray[1000],
});

const TitleSub = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[700],
});
