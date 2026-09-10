import KakaoMapIcon from '@assets/images/kakao_map.png';
import { BottomSheetModal, ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, createShadow, shadows, typography, withAlpha } from '@styles';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, type ImageSourcePropType } from 'react-native';
import { IconComponent } from '@components/Icons';
import { ApiError, type PlaceSearchItem, type PlaceSearchSource } from '../../controllers';
import { useInfinitePlaceSearchQuery } from '../../queries';
import { isAddressInCourseRegion, type CourseRegionForComparison } from './placeRegion';

interface CourseResultPlaceSearchModalProps {
  visible: boolean;
  isAdding: boolean;
  addError?: string;
  courseRegion: CourseRegionForComparison;
  onAdd: (places: PlaceSearchItem[]) => Promise<boolean>;
  onClose: () => void;
}

export function CourseResultPlaceSearchModal({
  visible,
  isAdding,
  addError,
  courseRegion,
  onAdd,
  onClose,
}: CourseResultPlaceSearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [source, setSource] = useState<PlaceSearchSource>('KAKAO');
  const [selectedPlaces, setSelectedPlaces] = useState<Record<string, PlaceSearchItem>>({});
  const [pendingPlaces, setPendingPlaces] = useState<PlaceSearchItem[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 100);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, error, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfinitePlaceSearchQuery({
      keyword: debouncedQuery,
      source,
      enabled: visible,
    });
  const results = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const selectedResults = Object.values(selectedPlaces);

  const placeKey = (place: PlaceSearchItem) => `${place.source}:${place.externalId}`;
  const togglePlace = (place: PlaceSearchItem) => {
    const key = placeKey(place);
    setSelectedPlaces((places) => {
      if (!(key in places)) return { ...places, [key]: place };
      const nextPlaces = { ...places };
      delete nextPlaces[key];
      return nextPlaces;
    });
  };

  const changeQuery = (text: string) => {
    setQuery(text);
    setSelectedPlaces({});
  };

  const changeSource = (nextSource: PlaceSearchSource) => {
    setSource(nextSource);
    setSelectedPlaces({});
  };

  const reset = () => {
    setSelectedPlaces({});
    setPendingPlaces(null);
    onClose();
  };

  const errorMessage =
    error instanceof ApiError && error.code === 'AUTH_REQUIRED'
      ? '로그인이 만료되었어요. 다시 로그인해 주세요.'
      : '검색 결과를 불러오지 못했어요.';

  const addSelectedPlaces = async (close: () => void) => {
    if (selectedResults.length === 0 || isAdding) return;

    const hasDifferentRegion = selectedResults.some(
      (place) => !isAddressInCourseRegion(place.address, courseRegion),
    );
    if (hasDifferentRegion) {
      setPendingPlaces(selectedResults);
      return;
    }

    if (await onAdd(selectedResults)) close();
  };

  const confirmDifferentRegion = async () => {
    if (!pendingPlaces || isAdding) return;
    if (await onAdd(pendingPlaces)) reset();
  };

  return (
    <>
      <BottomSheetModal
        baseHeight={760}
        accessibilityLabel="여행지 검색 닫기"
        visible={visible}
        onClose={reset}
      >
        {({ close }) => (
          <Content>
            <SearchArea>
              <SearchBox>
                <SearchIcon>⌕</SearchIcon>
                <SearchInput
                  accessibilityLabel="여행지 검색"
                  placeholder="장소명 또는 키워드 검색"
                  placeholderTextColor={colors.gray[300]}
                  returnKeyType="search"
                  value={query}
                  onChangeText={changeQuery}
                />
              </SearchBox>
              <Sources>
                <SourceButton active={source === 'TOUR'} onPress={() => changeSource('TOUR')}>
                  <SourceLabel active={source === 'TOUR'}>관광 API</SourceLabel>
                </SourceButton>
                <SourceButton active={source === 'KAKAO'} onPress={() => changeSource('KAKAO')}>
                  <SourceLabel active={source === 'KAKAO'}>카카오맵</SourceLabel>
                </SourceButton>
              </Sources>
            </SearchArea>

            {debouncedQuery.length === 0 ? (
              <EmptyState>검색어를 입력해 주세요.</EmptyState>
            ) : isPending ? (
              <LoadingState accessibilityLiveRegion="polite">
                <ActivityIndicator color={colors.primary[700]} />
                <StateText>여행지를 검색하고 있어요.</StateText>
              </LoadingState>
            ) : error ? (
              <LoadingState>
                <StateText>{errorMessage}</StateText>
                <RetryButton accessibilityRole="button" onPress={() => refetch()}>
                  <RetryText>다시 시도</RetryText>
                </RetryButton>
              </LoadingState>
            ) : (
              <FlatList
                style={resultsStyle}
                contentContainerStyle={resultsContentStyle}
                data={results}
                keyExtractor={placeKey}
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                ListEmptyComponent={<EmptyState>검색 결과가 없어요.</EmptyState>}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <PageLoading accessibilityLabel="다음 검색 결과 불러오는 중">
                      <ActivityIndicator color={colors.primary[700]} />
                    </PageLoading>
                  ) : null
                }
                renderItem={({ item: place }) => {
                  const key = placeKey(place);
                  const selected = key in selectedPlaces;
                  return (
                    <ResultCard
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      selected={selected}
                      onPress={() => togglePlace(place)}
                    >
                      {source === 'TOUR' ? (
                        <Thumbnail
                          accessibilityLabel={place.name}
                          resizeMode="cover"
                          source={place.imageUrl ? { uri: place.imageUrl } : undefined}
                        />
                      ) : null}
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
                }}
              />
            )}

            <Actions>
              <CancelButton accessibilityRole="button" onPress={close}>
                <CancelLabel>취소</CancelLabel>
              </CancelButton>
              <AddButton
                accessibilityRole="button"
                disabled={selectedResults.length === 0 || isAdding}
                onPress={() => void addSelectedPlaces(close)}
              >
                {isAdding ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <AddIcon>
                      <IconComponent
                        name="add_location"
                        color={
                          selectedResults.length === 0 ? colors.gray[200] : colors.primary[300]
                        }
                      />
                    </AddIcon>
                    <AddLabel disabled={selectedResults.length === 0}>선택 장소 추가</AddLabel>
                    <Count disabled={selectedResults.length === 0}>
                      ({selectedResults.length})
                    </Count>
                  </>
                )}
              </AddButton>
            </Actions>
            {addError ? <AddError accessibilityLiveRegion="polite">{addError}</AddError> : null}
          </Content>
        )}
      </BottomSheetModal>

      <ConfirmModal
        cancelText="다시 선택"
        confirmText="추가"
        disabled={isAdding}
        title="현재 여행지와 지역이 다릅니다."
        visible={pendingPlaces !== null}
        onCancel={() => setPendingPlaces(null)}
        onConfirm={confirmDifferentRegion}
      >
        <RegionWarningDescription>
          다른 지역 장소를 추가하면 이동 경로가 멀어질 수 있어요.{`\n`}그래도 추가하시겠어요?
        </RegionWarningDescription>
      </ConfirmModal>
    </>
  );
}

const Content = styled.View({ flex: 1, width: '100%' });

const RegionWarningDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const SearchArea = styled.View({
  paddingHorizontal: 20,
  paddingTop: 4,
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

const resultsStyle = {
  flex: 1,
  width: '100%',
} as const;

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

const Thumbnail = styled.Image({
  width: 46,
  height: 46,
  borderRadius: 8,
  backgroundColor: colors.gray[100],
});

const ResultInfo = styled.View({ flex: 1, minWidth: 0, gap: 8 });

const ResultHeading = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 8 });

const ResultName = styled.Text({ flex: 1, ...typography.body2.medium, color: colors.gray[1000] });

const MapIcon = styled.Image({ width: 22, height: 22, borderRadius: 9999 });

const Address = styled.Text({ ...typography.caption1.regular, color: colors.gray[700] });

const EmptyState = styled.Text({
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 48,
  ...typography.body3.regular,
  color: colors.gray[500],
  textAlign: 'center',
});

const LoadingState = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  gap: 12,
});

const StateText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});

const RetryText = styled.Text({
  ...typography.body3.medium,
  color: colors.primary[800],
});

const PageLoading = styled.View({
  height: 52,
  alignItems: 'center',
  justifyContent: 'center',
});

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

const AddError = styled.Text({
  position: 'absolute',
  right: 20,
  bottom: Platform.OS === 'web' ? 82 : 92,
  left: 20,
  zIndex: 101,
  padding: 10,
  borderRadius: 8,
  backgroundColor: colors.semantic.warningDisabled,
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
