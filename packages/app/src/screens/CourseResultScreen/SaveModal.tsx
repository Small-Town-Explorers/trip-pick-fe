import Landscape1 from '@assets/images/mock/landscape/landscape1.png';
import Landscape2 from '@assets/images/mock/landscape/landscape2.png';
import { IconComponent } from '@components/Icons';
import { BottomSheetModal, ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';

interface CourseResultSaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (folderName: string) => void;
}

const folders = [
  { id: 'saved', name: '저장한 코스', count: 12, image: Landscape1 },
  { id: 'healing', name: '힐링 여행', count: 3, image: Landscape2 },
  { id: 'small-city', name: '소도시 여행', count: 3, image: Landscape1 },
  { id: 'food', name: '맛집 여행', count: 3, image: Landscape2 },
];

export function CourseResultSaveModal({
  visible,
  onClose,
  onSave,
}: CourseResultSaveModalProps) {
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  const closeFolderModal = () => {
    setIsFolderModalVisible(false);
    setFolderName('');
  };

  const saveNewFolder = () => {
    const nextFolderName = folderName.trim();
    if (!nextFolderName) return;

    closeFolderModal();
    onSave(nextFolderName);
  };

  return (
    <>
      <BottomSheetModal
        visible={visible}
        title="코스 저장"
        onClose={onClose}
        sheetStyle={sheetStyle}
      >
        {() => (
          <FolderScroll contentContainerStyle={folderContentStyle}>
            <FolderGrid>
              <NewFolder
                accessibilityRole="button"
                accessibilityLabel="새 보관함 만들기"
                onPress={() => setIsFolderModalVisible(true)}
              >
                <IconComponent name="plus" size={40} color={colors.primary[600]} />
                <NewFolderLabel>새 보관함</NewFolderLabel>
              </NewFolder>
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${folder.name}에 저장`}
                  onPress={() => onSave(folder.name)}
                >
                  <FolderImage
                    source={folder.image as unknown as ImageSourcePropType}
                    resizeMode="cover"
                  />
                  <FolderInfo>
                    <FolderName numberOfLines={1}>{folder.name}</FolderName>
                    <FolderCount>{folder.count}개의 코스</FolderCount>
                  </FolderInfo>
                </FolderCard>
              ))}
            </FolderGrid>
          </FolderScroll>
        )}
      </BottomSheetModal>

      <ConfirmModal
        visible={isFolderModalVisible}
        title="새 보관함 만들기"
        onCancel={closeFolderModal}
        onConfirm={saveNewFolder}
      >
        <FolderForm>
          <FolderLabel>이름</FolderLabel>
          <FolderInput
            autoFocus
            maxLength={15}
            placeholder="이름을 입력하세요. (15자 이내)"
            placeholderTextColor={colors.gray[300]}
            returnKeyType="done"
            value={folderName}
            onChangeText={setFolderName}
            onSubmitEditing={saveNewFolder}
          />
        </FolderForm>
      </ConfirmModal>
    </>
  );
}

const sheetStyle = { height: 760, maxHeight: '90%' } as const;
const folderContentStyle = { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 } as const;

const FolderScroll = styled.ScrollView({ width: '100%' });
const FolderGrid = styled.View({ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 16 });
const NewFolder = styled.Pressable({
  width: '47.5%',
  height: 170,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: colors.gray[50],
  borderRadius: 12,
  ...Platform.select({ web: { boxShadow: '0 0 40px rgba(8, 25, 29, 0.1)' } }),
});
const NewFolderLabel = styled.Text({ ...typography.body1.medium, color: colors.gray[800] });
const FolderCard = styled.Pressable({
  width: '47.5%',
  height: 170,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...Platform.select({
    web: { boxShadow: '0 0 40px rgba(8, 25, 29, 0.1)' },
    ios: {
      shadowColor: '#08191D',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    android: { elevation: 5, shadowColor: '#08191D' },
  }),
});
const FolderImage = styled.Image({ width: '100%', height: 110 });
const FolderInfo = styled.View({ flex: 1, padding: 12, gap: 2 });
const FolderName = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const FolderCount = styled.Text({ ...typography.caption3.regular, color: colors.gray[600] });
const FolderForm = styled.View({ width: '100%', paddingBottom: 8, gap: 12, alignItems: 'flex-start' });
const FolderLabel = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const FolderInput = styled.TextInput({
  width: '100%',
  height: 50,
  paddingHorizontal: 16,
  ...typography.body2.regular,
  color: colors.gray[1000],
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: colors.gray[100],
  borderRadius: 12,
  ...Platform.select({ web: { outlineStyle: 'none' as never, outlineWidth: 0 } }),
});
