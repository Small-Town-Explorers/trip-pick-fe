import { IconComponent } from '@components/Icons';
import {
  KakaoLocationPickerMap,
  type KakaoMapAddressSearchRequest,
  type KakaoMapLocation,
} from '@components/KakaoMap';
import { BottomSheetModal, ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import type { ManualCourseItem } from '../../controllers';

interface CourseResultDirectPlaceModalProps {
  visible: boolean;
  isAdding: boolean;
  addError?: string;
  initialMapAddress: string;
  onAdd: (place: ManualCourseItem) => Promise<boolean>;
  onClose: () => void;
}

export function CourseResultDirectPlaceModal({
  visible,
  isAdding,
  addError,
  initialMapAddress,
  onAdd,
  onClose,
}: CourseResultDirectPlaceModalProps) {
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [location, setLocation] = useState<KakaoMapLocation>();
  const [pendingLocation, setPendingLocation] = useState<KakaoMapLocation>();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapQuery, setMapQuery] = useState('');
  const [addressSearchRequest, setAddressSearchRequest] =
    useState<KakaoMapAddressSearchRequest | null>(null);
  const [locationError, setLocationError] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const addressRequestIdRef = useRef(0);

  const reset = useCallback(() => {
    setName('');
    setMemo('');
    setLocation(undefined);
    setPendingLocation(undefined);
    setMapQuery('');
    setAddressSearchRequest(null);
    setLocationError('');
    setIsLocationLoading(false);
    setIsMapVisible(false);
    onClose();
  }, [onClose]);

  const openMap = () => {
    setPendingLocation(location);
    setMapQuery(location?.address ?? '');
    setAddressSearchRequest(null);
    setLocationError('');
    setIsLocationLoading(false);
    setIsMapVisible(true);
  };

  const closeMap = () => {
    setIsMapVisible(false);
    setPendingLocation(undefined);
    setMapQuery('');
    setAddressSearchRequest(null);
    setLocationError('');
    setIsLocationLoading(false);
  };

  const addLocation = () => {
    if (!pendingLocation || isLocationLoading) return;
    setLocation(pendingLocation);
    closeMap();
  };

  const searchAddress = () => {
    if (Platform.OS !== 'web') {
      setLocationError('지도 위치 선택은 웹에서 지원됩니다.');
      return;
    }
    const address = mapQuery.trim();
    if (!address) {
      setLocationError('검색할 주소를 입력해 주세요.');
      return;
    }
    addressRequestIdRef.current += 1;
    setAddressSearchRequest({ address, requestId: addressRequestIdRef.current });
  };

  return (
    <>
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
            <Form contentContainerStyle={formContentStyle} keyboardShouldPersistTaps="handled">
              <Field>
                <Label>장소명</Label>
                <Input
                  accessibilityLabel="장소명"
                  maxLength={15}
                  placeholder="장소 이름을 입력하세요. (15자 이내)"
                  placeholderTextColor={colors.gray[300]}
                  value={name}
                  onChangeText={setName}
                />
              </Field>

              <Field>
                <Label>장소 메모</Label>
                <MemoInput
                  accessibilityLabel="장소 메모"
                  maxLength={40}
                  multiline
                  placeholder="간단한 설명을 적어주세요. (40자 이내)"
                  placeholderTextColor={colors.gray[300]}
                  textAlignVertical="top"
                  value={memo}
                  onChangeText={setMemo}
                />
              </Field>

              <Field>
                <Label>위치</Label>
                {location ? (
                  <AddressBox>
                    <Address numberOfLines={1}>{location.address}</Address>
                    <TrashButton
                      accessibilityRole="button"
                      accessibilityLabel="위치 삭제"
                      onPress={() => setLocation(undefined)}
                    >
                      <IconComponent name="delete" size={20} color={colors.semantic.warning} />
                    </TrashButton>
                  </AddressBox>
                ) : null}
                <MapButton accessibilityRole="button" onPress={openMap}>
                  <IconComponent name="map" color={colors.primary[700]} />
                  <MapButtonLabel>{location ? '지도 정보 수정' : '지도 정보 찾기'}</MapButtonLabel>
                </MapButton>
                <Helper>미입력시 거리 계산 불가</Helper>
              </Field>
            </Form>

            {addError ? <AddError accessibilityLiveRegion="polite">{addError}</AddError> : null}
            <BottomAction>
              <ConfirmButton
                accessibilityRole="button"
                disabled={!name.trim() || isAdding}
                enabled={Boolean(name.trim()) && !isAdding}
                onPress={async () => {
                  if (!name.trim()) return;

                  const added = await onAdd({
                    name: name.trim(),
                    ...(memo.trim() ? { memo: memo.trim() } : {}),
                    ...(location
                      ? {
                          address: location.address,
                          lat: location.lat,
                          lng: location.lng,
                        }
                      : {}),
                  });
                  if (added) close();
                }}
              >
                {isAdding ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <IconComponent name="check_circle" size={24} color={colors.primary[300]} />
                    <ConfirmLabel>확인</ConfirmLabel>
                  </>
                )}
              </ConfirmButton>
            </BottomAction>
          </Content>
        )}
      </BottomSheetModal>

      <ConfirmModal
        cancelText="취소"
        confirmText="위치 추가"
        title="지도 정보 입력"
        visible={isMapVisible}
        width={340}
        disabled={isLocationLoading || !pendingLocation}
        onCancel={closeMap}
        onConfirm={addLocation}
      >
        <MapInfo>
          <MapDescription>
            직접 추가할 여행지의 주소를 입력해주세요.{`\n`}핀으로도 이동 가능합니다.
          </MapDescription>
          <MapSearch>
            <MapSearchButton
              accessibilityRole="button"
              accessibilityLabel="주소 검색"
              onPress={searchAddress}
            >
              <IconComponent name="search" color={colors.primary[600]} />
            </MapSearchButton>
            <MapQuery
              accessibilityLabel="여행지 주소 검색"
              autoFocus
              placeholder="주소를 입력해 주세요."
              placeholderTextColor={colors.gray[300]}
              returnKeyType="search"
              value={mapQuery}
              onChangeText={(value) => {
                setMapQuery(value);
                setLocationError('');
              }}
              onSubmitEditing={searchAddress}
            />
          </MapSearch>
          <MapPreview>
            {Platform.OS === 'web' ? (
              <KakaoLocationPickerMap
                addressSearchRequest={addressSearchRequest}
                height={300}
                initialCenterAddress={initialMapAddress}
                selectedCoordinate={pendingLocation}
                style={{ borderRadius: 12 }}
                onLocationError={setLocationError}
                onLocationLoadingChange={setIsLocationLoading}
                onLocationSelect={(nextLocation) => {
                  setPendingLocation(nextLocation);
                  setMapQuery(nextLocation.address);
                  setLocationError('');
                }}
              />
            ) : (
              <MapUnavailable>지도 위치 선택은 웹에서 지원됩니다.</MapUnavailable>
            )}
            {isLocationLoading ? (
              <MapLoading pointerEvents="none">
                <ActivityIndicator color={colors.primary[700]} />
              </MapLoading>
            ) : null}
          </MapPreview>
          <MapAddress numberOfLines={1}>
            {pendingLocation?.address ?? '검색하거나 지도를 눌러 위치를 선택해 주세요.'}
          </MapAddress>
          {locationError ? (
            <MapError accessibilityLiveRegion="polite">{locationError}</MapError>
          ) : null}
        </MapInfo>
      </ConfirmModal>
    </>
  );
}

const directSheetStyle = {
  maxWidth: 480,
  height: 680,
  maxHeight: '90%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const Content = styled.View({ flex: 1, width: '100%' });
const Form = styled.ScrollView({ flex: 1, width: '100%' });
const formContentStyle = {
  paddingHorizontal: 20,
  paddingTop: 24,
  paddingBottom: 128,
  gap: 24,
} as const;
const Field = styled.View({ width: '100%', gap: 12 });
const Label = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const Input = styled.TextInput({
  width: '100%',
  height: 50,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderWidth: 1,
  borderColor: colors.gray[100],
  borderRadius: 12,
  ...typography.body2.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});
const MemoInput = styled.TextInput({
  width: '100%',
  height: 72,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderWidth: 1,
  borderColor: colors.gray[100],
  borderRadius: 12,
  ...typography.body2.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never, resize: 'none' as never } }),
});
const AddressBox = styled.View({
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
  gap: 8,
  backgroundColor: colors.gray[25],
  borderRadius: 8,
});
const Address = styled.Text({ flex: 1, ...typography.body2.regular, color: colors.gray[800] });
const TrashButton = styled.Pressable({
  alignItems: 'center',
  justifyContent: 'center',
});
const MapButton = styled.Pressable({
  height: 52,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  backgroundColor: colors.primary[50],
  borderRadius: 8,
});
const MapButtonLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[800],
});
const Helper = styled.Text({
  ...typography.caption1.regular,
  color: colors.gray[600],
});
const BottomAction = styled.View({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  paddingHorizontal: 20,
  paddingTop: 18,
  paddingBottom: Platform.OS === 'web' ? 24 : 34,
  backgroundColor: withAlpha('#FFFFFF', 0.94),
});
const ConfirmButton = styled.Pressable<{ enabled: boolean }>(({ enabled }) => ({
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

const MapInfo = styled.View({
  width: '100%',
  gap: 12,
});
const MapDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const MapSearch = styled.View({
  width: '100%',
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
const MapQuery = styled.TextInput({
  flex: 1,
  minWidth: 0,
  height: 48,
  paddingVertical: 0,
  ...typography.body1.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});
const MapSearchButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});
const MapPreview = styled.View({
  position: 'relative',
  width: '100%',
  height: 300,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: withAlpha(colors.gray[1000], 0.1),
  borderRadius: 12,
  backgroundColor: colors.gray[25],
});
const MapLoading = styled.View({
  position: 'absolute',
  top: 12,
  right: 12,
  width: 36,
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 18,
  backgroundColor: withAlpha('#FFFFFF', 0.9),
});
const MapUnavailable = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
});
const MapAddress = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[800],
});
const MapError = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
});
