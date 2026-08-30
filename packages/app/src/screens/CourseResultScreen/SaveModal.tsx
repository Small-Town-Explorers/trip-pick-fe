import Landscape1 from '@assets/images/mock/landscape/landscape1.png';
import Landscape2 from '@assets/images/mock/landscape/landscape2.png';
import { IconComponent } from '@components/Icons';
import { BottomSheetModal, ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, shadows, typography } from '@styles';
import { useState } from 'react';
import { ActivityIndicator, Platform, type ImageSourcePropType } from 'react-native';
import { ApiError } from '../../controllers';
import { useCreateFolderMutation, useFoldersQuery } from '../../queries';

interface CourseResultSaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (folderName: string) => void;
}

const folderImages = [Landscape1, Landscape2];

export function CourseResultSaveModal({ visible, onClose, onSave }: CourseResultSaveModalProps) {
  const { data: folders = [], error, isPending, refetch } = useFoldersQuery(visible);
  const createFolderMutation = useCreateFolderMutation();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderError, setFolderError] = useState('');

  const closeFolderModal = () => {
    setIsFolderModalVisible(false);
    setFolderName('');
    setFolderError('');
  };

  const saveNewFolder = async () => {
    const nextFolderName = folderName.trim();
    if (!nextFolderName || createFolderMutation.isPending) return;

    setFolderError('');
    try {
      const folder = await createFolderMutation.mutateAsync({ name: nextFolderName });
      closeFolderModal();
      onSave(folder.name);
    } catch (mutationError) {
      setFolderError(
        mutationError instanceof ApiError && mutationError.code === 'FOLDER_DUPLICATE_NAME'
          ? '이미 사용 중인 보관함 이름이에요.'
          : mutationError instanceof ApiError
            ? mutationError.message
            : '보관함을 만들지 못했어요.',
      );
    }
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
              {isPending ? (
                <FolderLoading>
                  <ActivityIndicator color={colors.primary[700]} />
                </FolderLoading>
              ) : null}
              {error ? (
                <FolderLoading>
                  <FolderStateText>보관함을 불러오지 못했어요.</FolderStateText>
                  <RetryButton accessibilityRole="button" onPress={() => refetch()}>
                    <RetryText>다시 시도</RetryText>
                  </RetryButton>
                </FolderLoading>
              ) : null}
              {folders.map((folder, index) => (
                <FolderCard
                  key={folder.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${folder.name}에 저장`}
                  onPress={() => onSave(folder.name)}
                >
                  <FolderImage
                    source={
                      folderImages[index % folderImages.length] as unknown as ImageSourcePropType
                    }
                    resizeMode="cover"
                  />
                  <FolderInfo>
                    <FolderName numberOfLines={1}>{folder.name}</FolderName>
                    <FolderMeta>보관함</FolderMeta>
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
          {folderError ? <FolderError>{folderError}</FolderError> : null}
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
  ...shadows[2],
});
const NewFolderLabel = styled.Text({ ...typography.body1.medium, color: colors.gray[800] });
const FolderCard = styled.Pressable({
  width: '47.5%',
  height: 170,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...shadows[2],
});
const FolderImage = styled.Image({ width: '100%', height: 110 });
const FolderInfo = styled.View({ flex: 1, padding: 12, gap: 2 });
const FolderName = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const FolderMeta = styled.Text({ ...typography.caption3.regular, color: colors.gray[600] });
const FolderLoading = styled.View({
  width: '47.5%',
  height: 170,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
});
const FolderStateText = styled.Text({
  ...typography.caption1.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const RetryButton = styled.Pressable({
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.caption1.medium, color: colors.primary[800] });
const FolderForm = styled.View({
  width: '100%',
  paddingBottom: 8,
  gap: 12,
  alignItems: 'flex-start',
});
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
const FolderError = styled.Text({
  width: '100%',
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
