import { IconComponent } from '@components/Icons';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, shadows, typography, withAlpha } from '@styles';
import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView } from 'react-native';
import {
  getPersistedCourseChat,
  persistCourseChat,
  type CourseChatMessage,
} from '../../storage/courseChat';

interface CourseResultChatModalProps {
  courseId: string;
  regionName: string;
  visible: boolean;
  onSend: (message: string) => Promise<string>;
  onClose: () => void;
}

const suggestions = [
  '1일차 첫 장소 빼줘',
  '첫 장소 체류시간을 60분으로 바꿔줘',
  '전체 일정을 여유롭게 조정해줘',
];

const createMessage = (role: CourseChatMessage['role'], text: string): CourseChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  text,
});

export function CourseResultChatModal({
  courseId,
  regionName,
  visible,
  onSend,
  onClose,
}: CourseResultChatModalProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<CourseChatMessage[]>(() =>
    getPersistedCourseChat(courseId),
  );
  const [isSending, setIsSending] = useState(false);
  const [storageError, setStorageError] = useState('');
  const messagesRef = useRef(messages);
  const chatScrollRef = useRef<ScrollView>(null);

  const appendMessage = (message: CourseChatMessage) => {
    const nextMessages = [...messagesRef.current, message];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    void persistCourseChat(courseId, nextMessages)
      .then(() => setStorageError(''))
      .catch(() => {
        setStorageError(
          '대화를 기기에 저장하지 못했어요. 앱을 닫으면 최근 대화가 사라질 수 있어요.',
        );
      });
  };

  const send = async () => {
    const nextMessage = draft.trim();
    if (!nextMessage || isSending) return;

    appendMessage(createMessage('user', nextMessage));
    setDraft('');
    setIsSending(true);

    try {
      const reply = await onSend(nextMessage);
      appendMessage(createMessage('assistant', reply));
    } catch (error) {
      appendMessage(
        createMessage(
          'assistant',
          error instanceof Error
            ? error.message
            : '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BottomSheetModal
      title="코스 챗봇 편집"
      accessibilityLabel="챗봇 수정 닫기"
      baseHeight={760}
      avoidKeyboard
      sheetStyle={chatSheetStyle}
      visible={visible}
      onClose={onClose}
    >
      {() => (
        <Content>
          <ChatScroll
            ref={chatScrollRef}
            contentContainerStyle={chatContentStyle}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
          >
            <AiBubble>
              <BubbleText>
                {regionName || '현재'} 여행 코스에서{`\n`}어떤 부분을 편집하시겠어요?
              </BubbleText>
            </AiBubble>

            {messages.length === 0 ? (
              <Suggestions>
                {suggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    accessibilityRole="button"
                    onPress={() => setDraft(suggestion)}
                  >
                    <IconComponent name="arrow_right" size={24} color={colors.gray[300]} />
                    <SuggestionText>{suggestion}</SuggestionText>
                  </Suggestion>
                ))}
              </Suggestions>
            ) : null}

            {messages.map((message) =>
              message.role === 'user' ? (
                <UserBubble key={message.id}>
                  <UserText>{message.text}</UserText>
                </UserBubble>
              ) : (
                <AiBubble key={message.id}>
                  <BubbleText>{message.text}</BubbleText>
                </AiBubble>
              ),
            )}

            {isSending ? (
              <Thinking accessibilityLiveRegion="polite">
                <ActivityIndicator size="small" color={colors.primary[600]} />
                <ThinkingText>코스를 수정하고 있어요.</ThinkingText>
              </Thinking>
            ) : null}
          </ChatScroll>
          {storageError ? (
            <ThinkingText accessibilityLiveRegion="polite">{storageError}</ThinkingText>
          ) : null}

          <Composer>
            <Input
              accessibilityLabel="AI에게 여행 코스 수정 요청"
              editable={!isSending}
              placeholder="AI에게 여행 코스 수정 요청하기"
              placeholderTextColor={colors.gray[300]}
              returnKeyType="send"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
            />
            <SendButton
              accessibilityRole="button"
              disabled={!draft.trim() || isSending}
              onPress={send}
            >
              <IconComponent
                name="send"
                size={20}
                color={draft.trim() && !isSending ? colors.primary[700] : colors.gray[200]}
              />
            </SendButton>
          </Composer>
        </Content>
      )}
    </BottomSheetModal>
  );
}

const chatSheetStyle = {
  maxWidth: 480,
  height: '82%',
  minHeight: 620,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const Content = styled.View({ flex: 1, width: '100%' });
const ChatScroll = styled.ScrollView({ flex: 1, width: '100%' });
const chatContentStyle = { paddingHorizontal: 20, paddingBottom: 24, gap: 16 } as const;

const AiBubble = styled.View({
  alignSelf: 'flex-start',
  maxWidth: '90%',
  paddingHorizontal: 18,
  paddingVertical: 12,
  backgroundColor: colors.gray[25],
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  borderBottomLeftRadius: 12,
});

const BubbleText = styled.Text({ ...typography.body2.regular, color: colors.gray[1000] });
const Suggestions = styled.View({ alignItems: 'flex-start', gap: 14 });
const Suggestion = styled.Pressable({ flexDirection: 'row', alignItems: 'center', gap: 8 });
const SuggestionText = styled.Text({
  paddingVertical: 2,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[300],
  ...typography.body2.regular,
  color: colors.gray[700],
});

const UserBubble = styled.View({
  alignSelf: 'flex-end',
  maxWidth: '90%',
  paddingHorizontal: 18,
  paddingVertical: 12,
  backgroundColor: colors.primary[1000],
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
});

const UserText = styled.Text({ ...typography.body2.regular, color: '#FFFFFF', textAlign: 'right' });
const Thinking = styled.View({ flexDirection: 'row', alignItems: 'center', gap: 9 });
const ThinkingText = styled.Text({ ...typography.body2.regular, color: colors.primary[600] });

const Composer = styled.View({
  marginHorizontal: 20,
  marginVertical: 18,
  height: 52,
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 20,
  paddingRight: 10,
  gap: 8,
  backgroundColor: withAlpha('#FFFFFF', 0.9),
  borderWidth: 2,
  borderColor: '#FFFFFF',
  borderRadius: 9999,
  ...shadows[1],
});

const Input = styled.TextInput({
  flex: 1,
  minWidth: 0,
  paddingVertical: 0,
  ...typography.body2.regular,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});

const SendButton = styled.Pressable({
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});
