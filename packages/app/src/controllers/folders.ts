import { apiRequest } from './apiClient';

export type Folder = {
  id: string;
  name: string;
  createdAt: string;
  courseCount: number;
  imageUrl: string;
};

export type FolderNameRequest = {
  name: string;
};

export type RenameFolderRequest = FolderNameRequest & {
  id: string;
};

export function getFolders() {
  return apiRequest<Folder[]>('/api/v1/folders');
}

export function createFolder(request: FolderNameRequest) {
  return apiRequest<Folder>('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function renameFolder({ id, name }: RenameFolderRequest) {
  return apiRequest<Folder>(`/api/v1/folders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export function deleteFolder(id: string) {
  return apiRequest<void>(
    `/api/v1/folders/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    { allowEmptyResponse: true },
  );
}
