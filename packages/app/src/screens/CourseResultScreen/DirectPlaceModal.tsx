import { IconComponent } from '@components/Icons';
import { BottomSheetModal, ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography, withAlpha } from '@styles';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { type CoursePlaceInput } from './types';

interface CourseResultDirectPlaceModalProps {
  visible: boolean;
  onAdd: (place: CoursePlaceInput) => void;
  onClose: () => void;
}

const locationAddress = '전라남도 강진군 강진읍 만덕로 123';

export function CourseResultDirectPlaceModal({
  visible,
  onAdd,
  onClose,
}: CourseResultDirectPlaceModalProps) {
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [location, setLocation] = useState('');
  const [isMapVisible, setIsMapVisible] = useState(false);

  const reset = useCallback(() => {
    setName('');
    setMemo('');
    setLocation('');
    setIsMapVisible(false);
    onClose();
  }, [onClose]);

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
            <Form>
              <Field>
                <Label>장소명</Label>
                <Input
                  accessibilityLabel="장소명"
                  maxLength={15}
                  placeholder="장소 이름을 입력하세요. (15자 이내)"
                  placeholderTextColor={colors.gray[200]}
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
                  placeholderTextColor={colors.gray[200]}
                  textAlignVertical="top"
                  value={memo}
                  onChangeText={setMemo}
                />
              </Field>
              <Field>
                <Label>위치</Label>
                {location ? (
                  <AddressBox>
                    <Address numberOfLines={1}>{location}</Address>
                    <TrashButton
                      accessibilityRole="button"
                      accessibilityLabel="위치 삭제"
                      onPress={() => setLocation('')}
                    >
                      <IconComponent name="delete" color={colors.semantic.warning} />
                    </TrashButton>
                  </AddressBox>
                ) : null}
                <MapButton accessibilityRole="button" onPress={() => setIsMapVisible(true)}>
                  <IconComponent name="map" color={colors.primary[700]} />
                  <MapLabel>{location ? '지도 정보 수정' : '지도 정보 찾기'}</MapLabel>
                </MapButton>
                <Helper>미입력시 거리 계산 불가</Helper>
              </Field>
            </Form>

            <BottomAction>
              <ConfirmButton
                accessibilityRole="button"
                disabled={!name.trim()}
                enabled={Boolean(name.trim())}
                onPress={() => {
                  onAdd({
                    name: name.trim(),
                    description: memo.trim() || '직접 추가한 여행지',
                    type: '직접 추가',
                    mapUrl: location ? 'https://map.kakao.com' : undefined,
                  });
                  close();
                }}
              >
                <IconComponent name="check_circle" size={24} color={colors.primary[300]} />
                <ConfirmLabel>확인</ConfirmLabel>
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
        onCancel={() => setIsMapVisible(false)}
        onConfirm={() => {
          setLocation(locationAddress);
          setIsMapVisible(false);
        }}
      >
        <MapInfo>
          <MapDescription>
            직접 추가할 여행지의 주소를 입력해주세요.{`\n`}핀으로도 이동 가능합니다.
          </MapDescription>
          <MapSearch>
            <IconComponent name="search" color={colors.primary[600]} />
            <MapQuery />
          </MapSearch>
          <MapPreview>
            <MapPlaceholder>지도 API 연동 예정</MapPlaceholder>
          </MapPreview>
          <MapAddress>{locationAddress}</MapAddress>
        </MapInfo>
      </ConfirmModal>
    </>
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

const Form = styled.ScrollView({
  flex: 1,
  width: '100%',
  paddingHorizontal: 20,
  paddingTop: 20,
});
const Field = styled.View({ width: '100%', marginBottom: 24, gap: 12 });
const Label = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const Input = styled.TextInput({
  width: '100%',
  height: 50,
  paddingHorizontal: 16,
  paddingVertical: 0,
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
const MapLabel = styled.Text({
  ...typography.body2.medium,
  color: colors.primary[800],
});
const Helper = styled.Text({
  ...typography.caption1.regular,
  color: colors.gray[600],
});
const BottomAction = styled.View({
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

const MapInfo = styled.View({ width: '100%', gap: 12 });
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
});
const MapQuery = styled.TextInput({
  width: '100%',
  height: 50,
  ...typography.body1.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});
const MapPreview = styled.View({
  position: 'relative',
  width: '100%',
  height: 300,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: withAlpha(colors.gray[1000], 0.1),
  borderRadius: 12,
  backgroundColor: colors.gray[50],
});
const MapPlaceholder = styled.Text({
  position: 'absolute',
  right: 12,
  bottom: 10,
  ...typography.caption1.regular,
  color: colors.gray[500],
});
const MapAddress = styled.Text({ ...typography.body3.regular, color: colors.gray[800] });
