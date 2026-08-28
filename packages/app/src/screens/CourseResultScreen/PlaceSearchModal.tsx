import Landscape1Image from '@assets/images/mock/landscape/landscape1.png';
import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import KakaoMapIcon from '@assets/images/kakao_map.png';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, createShadow, shadows, typography, withAlpha } from '@styles';
import { useMemo, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';
import { type CoursePlaceInput } from './types';
import { IconComponent } from '@components/Icons';

interface CourseResultPlaceSearchModalProps {
  visible: boolean;
  onAdd: (places: CoursePlaceInput[]) => void;
  onClose: () => void;
}

const results = [
  { name: '오션뷰 부곡 카페', image: Landscape1Image },
  { name: '만덕사', image: Landscape2Image },
  { name: '부곡 횟집', image: Landscape1Image },
  { name: '오션뷰 부곡 카페', image: Landscape2Image },
  { name: '만덕사', image: Landscape1Image },
  { name: '부곡 횟집', image: Landscape2Image },
].map((place, index) => ({
  ...place,
  id: `search-${index}`,
  address: '전라남도 강진군 강진읍 만덕로 123',
}));

export function CourseResultPlaceSearchModal({
  visible,
  onAdd,
  onClose,
}: CourseResultPlaceSearchModalProps) {
  const [query, setQuery] = useState('부곡 해수욕장');
  const [source, setSource] = useState<'tour' | 'kakao'>('kakao');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedResults = useMemo(
    () => results.filter((place) => selectedIds.includes(place.id)),
    [selectedIds],
  );

  const togglePlace = (id: string) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id],
    );
  };

  const reset = () => {
    setSelectedIds([]);
    onClose();
  };

  return (
    <BottomSheetModal
      accessibilityLabel="여행지 검색 닫기"
      sheetStyle={searchSheetStyle}
      visible={visible}
      onClose={reset}
    >
      {({ close }) => (
        <Content>
          <SearchArea>
            <SearchBox>
              <SearchIcon>⌕</SearchIcon>
              <SearchInput accessibilityLabel="여행지 검색" value={query} onChangeText={setQuery} />
            </SearchBox>
            <Sources>
              <SourceButton active={source === 'tour'} onPress={() => setSource('tour')}>
                <SourceLabel active={source === 'tour'}>관광 API</SourceLabel>
              </SourceButton>
              <SourceButton active={source === 'kakao'} onPress={() => setSource('kakao')}>
                <SourceLabel active={source === 'kakao'}>카카오맵</SourceLabel>
              </SourceButton>
            </Sources>
          </SearchArea>

          <Results contentContainerStyle={resultsContentStyle}>
            {results.map((place) => {
              const selected = selectedIds.includes(place.id);
              return (
                <ResultCard
                  key={place.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  selected={selected}
                  onPress={() => togglePlace(place.id)}
                >
                  <Thumbnail
                    accessibilityLabel={place.name}
                    resizeMode="cover"
                    source={place.image as unknown as ImageSourcePropType}
                  />
                  <ResultInfo>
                    <ResultHeading>
                      <ResultName numberOfLines={1}>{place.name}</ResultName>
                      <MapIcon
                        accessibilityLabel="카카오맵"
                        resizeMode="cover"
                        source={KakaoMapIcon as unknown as ImageSourcePropType}
                      />
                    </ResultHeading>
                    <Address numberOfLines={1}>{place.address}</Address>
                  </ResultInfo>
                </ResultCard>
              );
            })}
          </Results>

          <Actions>
            <CancelButton accessibilityRole="button" onPress={close}>
              <CancelLabel>취소</CancelLabel>
            </CancelButton>
            <AddButton
              accessibilityRole="button"
              disabled={selectedResults.length === 0}
              onPress={() => {
                onAdd(
                  selectedResults.map((place) => ({
                    name: place.name,
                    description: place.address,
                    type: source === 'kakao' ? '카카오맵 장소' : '관광 명소',
                    mapUrl: 'https://map.kakao.com',
                  })),
                );
                close();
              }}
            >
              <AddIcon>
                <IconComponent
                  name="add_location"
                  color={selectedResults.length === 0 ? colors.gray[200] : colors.primary[300]}
                />
              </AddIcon>
              <AddLabel disabled={selectedResults.length === 0}>선택 장소 추가</AddLabel>
              <Count disabled={selectedResults.length === 0}>({selectedResults.length})</Count>
            </AddButton>
          </Actions>
        </Content>
      )}
    </BottomSheetModal>
  );
}

const searchSheetStyle = {
  maxWidth: 480,
  height: '88%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const Content = styled.View({ flex: 1, width: '100%' });

const SearchArea = styled.View({
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 20,
  gap: 14,
});

const SearchBox = styled.View({
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
  gap: 8,
  borderWidth: 1,
  borderColor: colors.primary[400],
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
});

const SearchIcon = styled.Text({ fontSize: 28, lineHeight: 28, color: colors.primary[600] });

const SearchInput = styled.TextInput({
  flex: 1,
  minWidth: 0,
  paddingVertical: 0,
  ...typography.body1.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});

const Sources = styled.View({ flexDirection: 'row', gap: 14 });

const SourceButton = styled.Pressable<{ active: boolean }>(({ active }) => ({
  flex: 1,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? colors.primary[600] : colors.gray[50],
  borderRadius: 8,
}));

const SourceLabel = styled.Text<{ active: boolean }>(({ active }) => ({
  ...typography.body2.medium,
  color: active ? '#FFFFFF' : colors.gray[700],
}));

const Results = styled.ScrollView({
  flex: 1,
  width: '100%',
});

const resultsContentStyle = {
  paddingTop: 16,
  paddingHorizontal: 20,
  paddingBottom: 108,
  gap: 14,
} as const;

const ResultCard = styled.Pressable<{ selected: boolean }>(
  ({ selected }) => ({ borderColor: selected ? colors.primary[600] : 'transparent' }),
  {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...shadows[2],
  },
);

const Thumbnail = styled.Image({ width: 46, height: 46, borderRadius: 8 });

const ResultInfo = styled.View({ flex: 1, minWidth: 0, gap: 8 });

const ResultHeading = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 8 });

const ResultName = styled.Text({ flex: 1, ...typography.body2.medium, color: colors.gray[1000] });

const MapIcon = styled.Image({ width: 22, height: 22, borderRadius: 9999 });

const Address = styled.Text({ ...typography.caption1.regular, color: colors.gray[700] });

const Actions = styled.View({
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  flexDirection: 'row',
  paddingHorizontal: 20,
  paddingTop: 18,
  paddingBottom: Platform.OS === 'web' ? 24 : 34,
  gap: 10,
  backgroundColor: withAlpha('#FFFFFF', 0.7),
  borderTopColor: '#FFFFFF',
  borderTopWidth: 2,
  borderStyle: 'solid',

  ...Platform.select({
    web: {
      position: 'fixed' as never,
      zIndex: 100,

      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: 480,
    },
    default: {
      position: 'absolute',
      zIndex: 100,
    },
  }),

  ...createShadow(0, 0, 30, 0, withAlpha(colors.gray[1000], 0.07)),
  ...Platform.select({
    web: {
      backdropFilter: 'blur(10px)',
    },
  }),
});

const CancelButton = styled.Pressable({
  width: 81,
  height: 48,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray[25],
  borderRadius: 8,
});

const CancelLabel = styled.Text({ ...typography.body2.medium, color: colors.gray[600] });

const AddButton = styled.Pressable(({ disabled }) => ({
  flex: 1,
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  backgroundColor: disabled ? withAlpha(colors.primary[1000], 0.1) : colors.primary[1000],
  borderRadius: 8,
  opacity: 1,
}));

const AddIcon = styled.View({});

const AddLabel = styled.Text(({ disabled }) => ({
  ...typography.body2.medium,
  color: disabled ? colors.gray[300] : '#FFFFFF',
}));

const Count = styled.Text(({ disabled }) => ({
  ...typography.body3.regular,
  color: disabled ? colors.gray[200] : withAlpha('#FFFFFF', 0.7),
}));
