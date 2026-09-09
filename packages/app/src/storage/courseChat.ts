import { localDataStorage } from './localDataStorage';

const STORAGE_PREFIX = 'trip-pick:course-chat:';

export type CourseChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const memoryChats = new Map<string, CourseChatMessage[]>();

const isCourseChatMessage = (value: unknown): value is CourseChatMessage => {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<CourseChatMessage>;
  return (
    typeof message.id === 'string' &&
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.text === 'string'
  );
};

export function persistCourseChat(courseId: string, messages: CourseChatMessage[]) {
  memoryChats.set(courseId, messages);
  return localDataStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(messages));
}

export function getPersistedCourseChat(courseId: string): CourseChatMessage[] {
  const memoryChat = memoryChats.get(courseId);
  if (memoryChat) return memoryChat;

  const key = `${STORAGE_PREFIX}${courseId}`;
  const storedChat = localDataStorage.getItemSnapshot(key);
  if (!storedChat) return [];

  try {
    const parsedChat = JSON.parse(storedChat) as unknown;
    if (!Array.isArray(parsedChat) || !parsedChat.every(isCourseChatMessage)) {
      throw new Error('Invalid course chat');
    }
    memoryChats.set(courseId, parsedChat);
    return parsedChat;
  } catch {
    void localDataStorage.removeItem(key).catch(() => {});
    return [];
  }
}
