import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { OptionGrid, type CourseOption } from './OptionGrid';

const styleOptions: readonly CourseOption[] = [
  {
    icon: {
      name: 'tree',
      color: colors.primary[800],
    },
    label: '힐링',
  },
  {
    icon: {
      name: 'local_dining',
      color: colors.primary[800],
    },
    label: '미식',
  },
  {
    icon: {
      name: 'kayaking',
      color: colors.primary[800],
    },
    label: '액티비티',
  },
  {
    icon: {
      name: 'storefront',
      color: colors.primary[800],
    },
    label: '로컬',
  },
  {
    icon: {
      name: 'local_mall',
      color: colors.primary[800],
    },
    label: '관광',
  },
  {
    icon: {
      name: 'castle',
      color: colors.primary[800],
    },
    label: '문화 · 역사',
  },
];

interface CourseCreateTravelStyleProps {
  value: string[];
  onChange: (styles: string[]) => void;
}

export function CourseCreateTravelStyle({ value, onChange }: CourseCreateTravelStyleProps) {
  const toggleStyle = (style: string) =>
    onChange(
      value.includes(style)
        ? value.filter((selectedStyle) => selectedStyle !== style)
        : [...value, style],
    );

  return (
    <Section>
      <Title>
        <TitleText>여행 스타일</TitleText>
        <TitleSub>{value.join(', ')}</TitleSub>
      </Title>
      <OptionGrid
        options={styleOptions}
        columns={3}
        selected={value}
        vertical
        onSelect={toggleStyle}
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
