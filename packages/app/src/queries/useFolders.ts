import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFolder, deleteFolder, getFolders, renameFolder, type Folder } from '../controllers';

export const foldersQueryKey = ['folders'] as const;

export function useFoldersQuery(enabled = true) {
  return useQuery({ queryKey: foldersQueryKey, queryFn: getFolders, enabled });
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: (folder) => {
      queryClient.setQueryData<Folder[]>(foldersQueryKey, (folders = []) => [folder, ...folders]);
    },
  });
}

export function useRenameFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameFolder,
    onSuccess: (renamedFolder) => {
      queryClient.setQueryData<Folder[]>(foldersQueryKey, (folders = []) =>
        folders.map((folder) => (folder.id === renamedFolder.id ? renamedFolder : folder)),
      );
    },
  });
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: (_response, folderId) => {
      queryClient.setQueryData<Folder[]>(foldersQueryKey, (folders = []) =>
        folders.filter((folder) => folder.id !== folderId),
      );
    },
  });
}
