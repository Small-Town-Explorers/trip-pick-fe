import { KakaoButton } from '@components/Buttons';
import { Header } from '@components/Header';
import { IconComponent } from '@components/Icons';
import { ConfirmModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, createShadow, shadows, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { ApiError, hasApiAccessToken, type Folder as FolderData } from '../../controllers';
import { appRoutes, useAppNavigation } from '../../navigation';
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useFoldersQuery,
  useRenameFolderMutation,
} from '../../queries';

const getFolderErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.code === 'FOLDER_DUPLICATE_NAME') {
    return '이미 사용 중인 보관함 이름이에요.';
  }
  return error instanceof ApiError ? error.message : fallback;
};

interface MyTripsScreenProps {
  headerTitle?: string;
  showCourseCount?: boolean;
  showSectionTitle?: boolean;
}

export function MyTripsScreen({
  headerTitle = '내 여행',
  showCourseCount = false,
  showSectionTitle = true,
}: MyTripsScreenProps = {}) {
  const { navigate } = useAppNavigation();
  const isAuthenticated = hasApiAccessToken();
  const { data: folders = [], error, isPending, refetch } = useFoldersQuery(isAuthenticated);
  const createFolderMutation = useCreateFolderMutation();
  const renameFolderMutation = useRenameFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [createName, setCreateName] = useState('');
  const [renameTarget, setRenameTarget] = useState<FolderData>();
  const [renameName, setRenameName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<FolderData>();
  const [formError, setFormError] = useState('');
  const savedCourseCount = folders.reduce((total, folder) => total + folder.courseCount, 0);

  if (!isAuthenticated) {
    return (
      <Screen>
        <Header title={headerTitle} />
        <UnauthenticatedContent>
          <LoginPrompt>
            <IconComponent name="profile" color={colors.primary[500]} size={28} />
            <LoginPromptTitle>{'로그인하고 여행 코스를 내 보관함에\n저장하세요.'}</LoginPromptTitle>
            <LoginPromptDescription>
              {
                '발굴한 여행 코스를 테마별로 정리하고,\n언제든 꺼내어 여행 계획을 편집하거나 볼 수 있어요.'
              }
            </LoginPromptDescription>
          </LoginPrompt>
          <KakaoButton onPress={() => navigate(appRoutes.login)} />
        </UnauthenticatedContent>
      </Screen>
    );
  }

  const closeCreateModal = () => {
    setIsCreateVisible(false);
    setCreateName('');
    setFormError('');
  };

  const createFolder = async () => {
    const name = createName.trim();
    if (!name || createFolderMutation.isPending) return;

    setFormError('');
    try {
      await createFolderMutation.mutateAsync({ name });
      closeCreateModal();
    } catch (mutationError) {
      setFormError(getFolderErrorMessage(mutationError, '보관함을 만들지 못했어요.'));
    }
  };

  const closeRenameModal = () => {
    setRenameTarget(undefined);
    setRenameName('');
    setFormError('');
  };

  const renameFolder = async () => {
    const name = renameName.trim();
    if (!renameTarget || !name || renameFolderMutation.isPending) return;

    setFormError('');
    try {
      await renameFolderMutation.mutateAsync({ id: renameTarget.id, name });
      closeRenameModal();
    } catch (mutationError) {
      setFormError(getFolderErrorMessage(mutationError, '이름을 변경하지 못했어요.'));
    }
  };

  const deleteFolder = async () => {
    if (!deleteTarget || deleteFolderMutation.isPending) return;

    setFormError('');
    try {
      await deleteFolderMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(undefined);
    } catch (mutationError) {
      setFormError(getFolderErrorMessage(mutationError, '보관함을 삭제하지 못했어요.'));
    }
  };

  return (
    <Screen>
      <Header title={headerTitle} sub={showCourseCount ? `(${savedCourseCount})` : undefined} />
      <Scroll contentContainerStyle={contentStyle}>
        {showSectionTitle ? <SectionTitle>내 여행 보관함</SectionTitle> : null}
        {error ? (
          <Status>
            <StatusText>보관함을 불러오지 못했어요.</StatusText>
            <RetryButton accessibilityRole="button" onPress={() => refetch()}>
              <RetryText>다시 시도</RetryText>
            </RetryButton>
          </Status>
        ) : null}
        <Grid>
          <NewFolder
            accessibilityRole="button"
            onPress={() => {
              setFormError('');
              setIsCreateVisible(true);
            }}
          >
            <IconComponent name="plus" color={colors.primary[700]} size={40} />
            <NewFolderText>새 보관함</NewFolderText>
          </NewFolder>
          {isPending ? (
            <LoadingCard>
              <ActivityIndicator color={colors.primary[700]} />
            </LoadingCard>
          ) : (
            folders.map((folder) => (
              <Folder
                key={folder.id}
                active={openedMenuId === folder.id}
                accessibilityRole="button"
                onPress={() => {
                  if (openedMenuId) {
                    setOpenedMenuId(null);
                    return;
                  }
                  navigate(appRoutes.myTripFolder(folder.id));
                }}
              >
                <FolderImage source={{ uri: folder.imageUrl }} resizeMode="cover" />
                <FolderInfo>
                  <FolderInfoHeader>
                    <FolderName numberOfLines={1}>{folder.name}</FolderName>
                    <FolderEditButton
                      accessibilityRole="button"
                      accessibilityLabel={`${folder.name} 메뉴`}
                      onPress={(event) => {
                        event.stopPropagation();
                        setOpenedMenuId((current) => (current === folder.id ? null : folder.id));
                      }}
                    >
                      <IconComponent name="donut_menu" />
                    </FolderEditButton>
                  </FolderInfoHeader>
                  <FolderMeta>보관함</FolderMeta>
                </FolderInfo>
                {openedMenuId === folder.id ? (
                  <FolderMenu>
                    <MenuButton
                      accessibilityRole="button"
                      accessibilityLabel={`${folder.name} 이름 변경`}
                      onPress={(event) => {
                        event.stopPropagation();
                        setOpenedMenuId(null);
                        setFormError('');
                        setRenameTarget(folder);
                        setRenameName(folder.name);
                      }}
                    >
                      <MenuText>이름 변경</MenuText>
                      <IconComponent name="pencil" color={colors.gray[600]} size={20} />
                    </MenuButton>
                    <MenuButton
                      accessibilityRole="button"
                      accessibilityLabel={`${folder.name} 삭제`}
                      onPress={(event) => {
                        event.stopPropagation();
                        setOpenedMenuId(null);
                        setFormError('');
                        setDeleteTarget(folder);
                      }}
                    >
                      <MenuText>삭제</MenuText>
                      <IconComponent name="delete" color={colors.semantic.warning} size={20} />
                    </MenuButton>
                  </FolderMenu>
                ) : null}
              </Folder>
            ))
          )}
        </Grid>
      </Scroll>

      <ConfirmModal
        visible={isCreateVisible}
        title="새 보관함 만들기"
        onCancel={closeCreateModal}
        onConfirm={createFolder}
      >
        <FolderForm>
          <FolderLabel>이름</FolderLabel>
          <FolderInput
            autoFocus
            maxLength={15}
            placeholder="이름을 입력하세요. (15자 이내)"
            placeholderTextColor={colors.gray[300]}
            returnKeyType="done"
            value={createName}
            onChangeText={setCreateName}
            onSubmitEditing={createFolder}
          />
          {formError ? <FormError>{formError}</FormError> : null}
        </FolderForm>
      </ConfirmModal>

      <ConfirmModal
        visible={Boolean(renameTarget)}
        title="보관함 이름 변경"
        onCancel={closeRenameModal}
        onConfirm={renameFolder}
      >
        <FolderForm>
          <FolderLabel>이름</FolderLabel>
          <FolderInput
            autoFocus
            maxLength={15}
            placeholder="이름을 입력하세요. (15자 이내)"
            placeholderTextColor={colors.gray[300]}
            returnKeyType="done"
            value={renameName}
            onChangeText={setRenameName}
            onSubmitEditing={renameFolder}
          />
          {formError ? <FormError>{formError}</FormError> : null}
        </FolderForm>
      </ConfirmModal>

      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        title="보관함 삭제"
        visible={Boolean(deleteTarget)}
        onCancel={() => {
          setDeleteTarget(undefined);
          setFormError('');
        }}
        onConfirm={deleteFolder}
      >
        <DeleteDescription>
          &apos;{deleteTarget?.name ?? ''}&apos; 보관함을{`\n`}삭제하시겠습니까?
        </DeleteDescription>
        {formError ? <FormError>{formError}</FormError> : null}
      </ConfirmModal>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });

const UnauthenticatedContent = styled.View({
  flex: 1,
  width: '100%',
  paddingHorizontal: 20,
  paddingTop: 24,
  gap: 20,
});

const LoginPrompt = styled.View({
  width: '100%',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 32,
  gap: 12,
  borderRadius: 16,
  backgroundColor: colors.gray[25],
});

const LoginPromptTitle = styled.Text({
  ...typography.body1.medium,
  color: colors.gray[800],
  textAlign: 'center',
});

const LoginPromptDescription = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
  textAlign: 'center',
});

const Scroll = styled.ScrollView({ position: 'relative', flex: 1 });
const contentStyle = { padding: 20, gap: 20 } as const;
const SectionTitle = styled.Text({ ...typography.heading2.medium, color: colors.gray[1000] });
const Grid = styled.View({ flexDirection: 'row', flexWrap: 'wrap', gap: 12 });

const NewFolder = styled.Pressable({
  width: '48%',
  height: 190,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: 'white',
  borderRadius: 12,
  ...shadows[2],
});
const NewFolderText = styled.Text({ ...typography.body1.medium, color: colors.gray[800] });

const LoadingCard = styled.View({
  width: '48%',
  height: 190,
  alignItems: 'center',
  justifyContent: 'center',
});

const Folder = styled.Pressable<{ active: boolean }>(({ active }) => ({
  width: '48%',
  zIndex: active ? 20 : 0,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.gray[100],
  ...shadows[2],
}));
const FolderImage = styled.Image({
  width: '100%',
  height: 130,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  backgroundColor: colors.gray[100],
});
const FolderInfo = styled.View({ padding: 12, gap: 4 });
const FolderInfoHeader = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 8 });
const FolderName = styled.Text({ flex: 1, ...typography.body2.medium, color: colors.gray[1000] });
const FolderEditButton = styled.Pressable({ padding: 2 });
const FolderMeta = styled.Text({ ...typography.caption3.regular, color: colors.gray[600] });

const FolderMenu = styled.View({
  position: 'absolute',
  right: -10,
  bottom: -70,
  zIndex: 30,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  ...createShadow(0, 4, 20, 0, withAlpha(colors.gray[1000], 0.12)),
});
const MenuButton = styled.Pressable({
  height: 44,
  paddingHorizontal: 14,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});
const MenuText = styled.Text({ ...typography.body2.medium, color: colors.gray[600] });
const Status = styled.View({ alignItems: 'center', gap: 10, paddingVertical: 16 });
const StatusText = styled.Text({ ...typography.body3.regular, color: colors.gray[600] });
const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });

const FolderForm = styled.View({ width: '100%', paddingBottom: 8, gap: 12 });
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
const FormError = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
const DeleteDescription = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
