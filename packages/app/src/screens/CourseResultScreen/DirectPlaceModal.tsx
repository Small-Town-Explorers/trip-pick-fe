import KakaoMapIcon from '@assets/images/kakao_map.png';
import { IconComponent } from '@components/Icons';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, shadows, typography, withAlpha } from '@styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, type ImageSourcePropType } from 'react-native';
import { ApiError, type PlaceSearchItem } from '../../controllers';
import { useInfinitePlaceSearchQuery } from '../../queries';

interface CourseResultDirectPlaceModalProps {
  visible: boolean;
  isAdding: boolean;
  addError?: string;
  onAdd: (place: PlaceSearchItem) => Promise<boolean>;
  onClose: () => void;
}

export function CourseResultDirectPlaceModal({
  visible,
  isAdding,
  addError,
  onAdd,
  onClose,
}: CourseResultDirectPlaceModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchItem>();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 150);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, error, isPending, refetch } = useInfinitePlaceSearchQuery({
    keyword: debouncedQuery,
    source: 'KAKAO',
    enabled: visible,
  });
  const results = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const reset = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSelectedPlace(undefined);
    onClose();
  }, [onClose]);

  const changeQuery = (text: string) => {
    setQuery(text);
    setSelectedPlace(undefined);
  };

  const searchError =
    error instanceof ApiError && error.code === 'AUTH_REQUIRED'
      ? '로그인이 만료되었어요. 다시 로그인해 주세요.'
      : '장소를 찾지 못했어요. 다시 검색해 주세요.';

  return (
    <BottomSheetModal
      accessibilityLabel="여행지 직접 추가 닫기"
      avoidKeyboard
      sheetStyle={directSheetStyle}
      visible={visible}
      onClose={reset}
      title="여행지 직접 추가하기"
    >
      {({ close }) => (
        <Content>
          <SearchArea>
            <Description>
              장소명을 입력하고 실제 위치를 선택해 주세요. 선택한 위치를 기준으로 이동 경로가 다시
              계산됩니다.
            </Description>
            <SearchBox>
              <IconComponent name="search" color={colors.primary[600]} />
              <SearchInput
                accessibilityLabel="직접 추가할 장소 검색"
                autoFocus
                placeholder="장소 이름을 입력하세요."
                placeholderTextColor={colors.gray[300]}
                returnKeyType="search"
                value={query}
                onChangeText={changeQuery}
              />
            </SearchBox>
          </SearchArea>

          {debouncedQuery.length === 0 ? (
            <EmptyState>추가할 장소를 검색해 주세요.</EmptyState>
          ) : isPending ? (
            <State>
              <ActivityIndicator color={colors.primary[700]} />
              <StateText>카카오맵에서 장소를 찾고 있어요.</StateText>
            </State>
          ) : error ? (
            <State>
              <StateText>{searchError}</StateText>
              <RetryButton accessibilityRole="button" onPress={() => refetch()}>
                <RetryLabel>다시 시도</RetryLabel>
              </RetryButton>
            </State>
          ) : (
            <FlatList
              style={resultsStyle}
              contentContainerStyle={resultsContentStyle}
              data={results}
              keyExtractor={(place) => `${place.source}:${place.externalId}`}
              ListEmptyComponent={<EmptyState>검색 결과가 없어요.</EmptyState>}
              renderItem={({ item: place }) => {
                const selected = selectedPlace?.externalId === place.externalId;
                return (
                  <ResultCard
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    selected={selected}
                    onPress={() => setSelectedPlace(place)}
                  >
                    <MapIcon
                      accessibilityLabel="카카오맵"
                      resizeMode="cover"
                      source={KakaoMapIcon as unknown as ImageSourcePropType}
                    />
                    <ResultInfo>
                      <ResultName numberOfLines={1}>{place.name}</ResultName>
                      <Address numberOfLines={1}>{place.address}</Address>
                    </ResultInfo>
                    {selected ? (
                      <IconComponent name="check_circle" color={colors.primary[700]} />
                    ) : null}
                  </ResultCard>
                );
              }}
            />
          )}

          {addError ? <AddError accessibilityLiveRegion="polite">{addError}</AddError> : null}
          <BottomAction>
            <CancelButton accessibilityRole="button" disabled={isAdding} onPress={close}>
              <CancelLabel>취소</CancelLabel>
            </CancelButton>
            <ConfirmButton
              accessibilityRole="button"
              disabled={!selectedPlace || isAdding}
              enabled={Boolean(selectedPlace) && !isAdding}
              onPress={async () => {
                if (selectedPlace && (await onAdd(selectedPlace))) close();
              }}
            >
              {isAdding ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <IconComponent name="add_location" size={24} color={colors.primary[300]} />
                  <ConfirmLabel>선택 장소 추가</ConfirmLabel>
                </>
              )}
            </ConfirmButton>
          </BottomAction>
        </Content>
      )}
    </BottomSheetModal>
  );
}

const directSheetStyle = {
  maxWidth: 480,
  height: '80%',
  minHeight: 620,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const Content = styled.View({ flex: 1, width: '100%' });

const SearchArea = styled.View({
  paddingHorizontal: 20,
  paddingTop: 18,
  paddingBottom: 14,
  gap: 14,
});

const Description = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  lineHeight: 21,
});

const SearchBox = styled.View({
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  gap: 8,
  borderWidth: 1,
  borderColor: colors.primary[400],
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
});

const SearchInput = styled.TextInput({
  flex: 1,
  minWidth: 0,
  paddingVertical: 0,
  ...typography.body2.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});

const resultsStyle = { flex: 1, width: '100%' } as const;
const resultsContentStyle = {
  paddingHorizontal: 20,
  paddingVertical: 10,
  paddingBottom: 120,
  gap: 12,
} as const;

const ResultCard = styled.Pressable<{ selected: boolean }>(
  ({ selected }) => ({ borderColor: selected ? colors.primary[600] : colors.gray[50] }),
  {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    ...shadows[1],
  },
);

const MapIcon = styled.Image({ width: 36, height: 36, borderRadius: 9999 });
const ResultInfo = styled.View({ flex: 1, minWidth: 0, gap: 6 });
const ResultName = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const Address = styled.Text({ ...typography.caption1.regular, color: colors.gray[600] });

const EmptyState = styled.Text({
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 48,
  ...typography.body3.regular,
  color: colors.gray[500],
  textAlign: 'center',
});

const State = styled.View({
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
const RetryLabel = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });

const BottomAction = styled.View({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  flexDirection: 'row',
  paddingHorizontal: 20,
  paddingTop: 18,
  paddingBottom: Platform.OS === 'web' ? 24 : 34,
  gap: 10,
  backgroundColor: withAlpha('#FFFFFF', 0.94),
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

const ConfirmButton = styled.Pressable<{ enabled: boolean }>(({ enabled }) => ({
  flex: 1,
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  backgroundColor: colors.primary[1000],
  borderRadius: 8,
  opacity: enabled ? 1 : 0.45,
}));
const ConfirmLabel = styled.Text({ ...typography.body2.medium, color: '#FFFFFF' });

const AddError = styled.Text({
  position: 'absolute',
  right: 20,
  bottom: Platform.OS === 'web' ? 82 : 92,
  left: 20,
  zIndex: 1,
  padding: 10,
  borderRadius: 8,
  backgroundColor: colors.semantic.warningDisabled,
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
