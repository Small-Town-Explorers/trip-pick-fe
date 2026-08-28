import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { OptionGrid, type CourseOption } from './OptionGrid';
import { IconComponent } from '@components/Icons';
import { Platform } from 'react-native';

const regionOptions: readonly CourseOption[] = [
  {
    icon: {
      name: 'mountain',
      color: colors.primary[600],
    },
    label: '산 · 숲',
  },
  {
    icon: {
      name: 'water_wave',
      color: colors.sub[400],
    },
    label: '바다 · 강',
  },
  {
    icon: {
      name: 'vehicle',
      color: colors.primary[600],
    },
    label: '수도권 근교',
  },
  {
    icon: {
      name: 'shuffle',
      color: colors.sub[400],
    },
    label: '랜덤',
  },
];

interface CourseCreateRegionProps {
  value: string;
  onChange: (region: string) => void;
}

export function CourseCreateRegion({ value, onChange }: CourseCreateRegionProps) {
  const isSuggestedRegion = regionOptions.some((option) => option.label === value);
  const selectedRegions = isSuggestedRegion ? [value] : [];

  const isSuggestionEnabled = value.length === 0 || isSuggestedRegion;
  const isSearchInputEnabled = !isSuggestedRegion;

  const selectRegion = (region: string) => onChange(region === value ? '' : region);

  return (
    <Section>
      <SearchGroup>
        <Title>
          <TitleText>생각해둔 지역이 있나요?</TitleText>
          <TitleSub>{value}</TitleSub>
        </Title>

        <SearchInput
          placeholder={isSearchInputEnabled ? '지역명 검색' : '선택 완료'}
          placeholderTextColor={isSearchInputEnabled ? colors.gray[300] : colors.gray[200]}
          editable={isSearchInputEnabled}
          value={isSuggestedRegion ? '' : value}
          onChangeText={onChange}
        />
      </SearchGroup>

      <SuggestionGroup>
        <SuggestionTitle>
          <SuggestionArrow>
            <IconComponent
              name="arrow_right"
              color={isSuggestionEnabled ? colors.primary[900] : colors.gray[300]}
            />
          </SuggestionArrow>
          <SuggestionText isEnabled={isSuggestionEnabled}>
            혹시, 어디로 갈지 모르겠다면?
          </SuggestionText>
        </SuggestionTitle>
        <OptionGrid
          options={regionOptions}
          columns={2}
          selected={selectedRegions}
          onSelect={selectRegion}
          enabled={isSuggestionEnabled}
        />
      </SuggestionGroup>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 20,
});

const SearchGroup = styled.View({
  width: '100%',
  gap: 12,
});

const Title = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
});

const TitleText = styled.Text({
  ...typography.heading4.medium,
  color: colors.gray[1000],
});

const TitleSub = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[700],
});

const SearchInput = styled.TextInput(({ editable }) => ({
  width: '100%',
  height: 45,
  paddingHorizontal: 20,
  paddingVertical: 11.5,
  ...typography.body2.regular,
  color: colors.gray[1000],
  backgroundColor: editable ? '#FFFFFF' : colors.gray[25],
  borderWidth: 1,
  borderColor: editable ? colors.primary[400] : colors.gray[100],
  borderRadius: 9999,

  ...Platform.select({
    web: {
      outlineStyle: 'none' as never,
      outlineWidth: 0,
      outlineColor: 'transparent',
      boxShadow: 'none',
    },
  }),
}));

const SuggestionGroup = styled.View({
  width: '100%',
  gap: 12,
});

const SuggestionTitle = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const SuggestionArrow = styled.View({
  width: 18,
  height: 18,
});

const SuggestionText = styled.Text<{ isEnabled?: boolean }>(({ isEnabled }) => ({
  ...typography.body3.medium,
  color: isEnabled ? colors.primary[900] : colors.gray[300],
}));
