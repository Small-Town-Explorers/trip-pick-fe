import Landscape2Image from '@assets/images/mock/landscape/landscape2.png';
import { IconComponent } from '@components/Icons';
import { BottomSheetModal } from '@components/Modal';
import styled from '@emotion/native';
import { colors, shadows, typography, withAlpha } from '@styles';
import { useCallback, useEffect, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';

interface CourseResultChatModalProps {
  visible: boolean;
  onClose: () => void;
}

type ChatPhase = 'initial' | 'thinking' | 'answered';

const suggestions = [
  '첫날 카페 추가하기',
  '첫날 식당 변경하기',
  '마지막 날 일정 줄이기',
  '첫날 관광지 하나 추가하기',
  '저녁 일정에 로컬 맛집 추가하기',
];

export function CourseResultChatModal({ visible, onClose }: CourseResultChatModalProps) {
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<ChatPhase>('initial');

  useEffect(() => {
    if (phase !== 'thinking') return;
    const timer = setTimeout(() => setPhase('answered'), 1200);
    return () => clearTimeout(timer);
  }, [phase]);

  const close = useCallback(() => {
    setDraft('');
    setMessage('');
    setPhase('initial');
    onClose();
  }, [onClose]);

  const send = () => {
    const nextMessage = draft.trim();
    if (!nextMessage) return;
    setMessage(nextMessage);
    setDraft('');
    setPhase('thinking');
  };

  const selectSuggestion = (suggestion: string) => setDraft(suggestion);

  return (
    <BottomSheetModal
      title="코스 챗봇 편집"
      accessibilityLabel="챗봇 수정 닫기"
      avoidKeyboard
      sheetStyle={chatSheetStyle}
      visible={visible}
      onClose={close}
    >
      {() => (
        <Content>
          <ChatScroll contentContainerStyle={chatContentStyle} keyboardShouldPersistTaps="handled">
            <AiBubble>
              <BubbleText>강진 힐링 코스에서{`\n`}어떤 부분을 편집 하시겠어요?</BubbleText>
            </AiBubble>

            {phase === 'initial' ? (
              <Suggestions>
                {suggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    accessibilityRole="button"
                    onPress={() => selectSuggestion(suggestion)}
                  >
                    <IconComponent name="arrow_right" size={24} color={colors.gray[300]} />
                    <SuggestionText>{suggestion}</SuggestionText>
                  </Suggestion>
                ))}
              </Suggestions>
            ) : (
              <UserBubble>
                <UserText>{message}</UserText>
              </UserBubble>
            )}

            {phase === 'thinking' ? (
              <Thinking>
                <Dots>
                  <Dot />
                  <Dot raised />
                  <Dot muted />
                </Dots>
                <ThinkingText>생각 중</ThinkingText>
              </Thinking>
            ) : null}

            {phase === 'answered' ? (
              <Answer>
                <AiBubbleWide>
                  <BubbleText>
                    백련사 일정 이후 근교 카페 소도시로 카페를 추천합니다. 이 장소는 어떠신가요?
                  </BubbleText>
                </AiBubbleWide>
                <PlaceCard>
                  <PlaceImage
                    accessibilityLabel="소도시로 카페 전경"
                    resizeMode="cover"
                    source={Landscape2Image as unknown as ImageSourcePropType}
                  />
                  <Rating>
                    <RatingText>★ 4.9</RatingText>
                  </Rating>
                  <PlaceInfo>
                    <PlaceName>소도시로 카페</PlaceName>
                    <PlaceDescription>
                      천년 고찰의 고즈넉함과 어우러진 핸드드립 전문점
                    </PlaceDescription>
                    <Tags>
                      <Tag>
                        <TagText>카페</TagText>
                      </Tag>
                      <Tag>
                        <TagText>자연 경관</TagText>
                      </Tag>
                    </Tags>
                    <DetailText>● 10:00 - 20:00</DetailText>
                    <DetailText>● 전남 강진군 도암면 만덕리 396-3</DetailText>
                  </PlaceInfo>
                </PlaceCard>
                <Suggestions>
                  {[
                    '추천 장소 코스에 추가하기',
                    '다른 장소 추천 받기',
                    '이 근처 다른 장소도 추천 받기',
                  ].map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      accessibilityRole="button"
                      onPress={() => selectSuggestion(suggestion)}
                    >
                      <IconComponent name="arrow_right" size={24} color={colors.gray[300]} />
                      <SuggestionText>{suggestion}</SuggestionText>
                    </Suggestion>
                  ))}
                </Suggestions>
              </Answer>
            ) : null}
          </ChatScroll>

          <Composer>
            <Input
              accessibilityLabel="AI에게 여행 코스 수정 요청"
              placeholder="AI에게 여행 코스 수정 요청하기"
              placeholderTextColor={colors.gray[300]}
              returnKeyType="send"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
            />
            <SendButton accessibilityRole="button" disabled={!draft.trim()} onPress={send}>
              <IconComponent
                name="send"
                size={20}
                color={draft.trim() ? colors.primary[700] : colors.gray[200]}
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
  paddingHorizontal: 18,
  paddingVertical: 12,
  backgroundColor: colors.gray[25],
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  borderBottomLeftRadius: 12,
});
const AiBubbleWide = styled(AiBubble)({ maxWidth: 317 });
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
const Dots = styled.View({
  width: 18,
  height: 12,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
});
const Dot = styled.View<{ raised?: boolean; muted?: boolean }>(
  ({ raised, muted }) => ({
    marginBottom: raised ? 6 : 0,
    backgroundColor: muted ? colors.primary[300] : colors.primary[600],
  }),
  { width: 4, height: 4, borderRadius: 9999 },
);
const ThinkingText = styled.Text({ ...typography.body2.regular, color: colors.primary[600] });
const Answer = styled.View({ gap: 16 });
const PlaceCard = styled.View({
  width: '100%',
  maxWidth: 315,
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
});
const PlaceImage = styled.Image({ width: '100%', height: 160 });

const Rating = styled.View({
  position: 'absolute',
  right: 16,
  top: 16,
  paddingHorizontal: 12,
  paddingVertical: 4,
  backgroundColor: withAlpha('#FFFFFF', 0.8),
  borderRadius: 9999,
});

const RatingText = styled.Text({ ...typography.caption1.regular, color: colors.primary[900] });
const PlaceInfo = styled.View({ padding: 16, gap: 8 });
const PlaceName = styled.Text({ ...typography.body1.medium, color: colors.gray[1000] });
const PlaceDescription = styled.Text({ ...typography.caption1.regular, color: colors.gray[700] });
const Tags = styled.View({ flexDirection: 'row', gap: 8 });
const Tag = styled.View({
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});
const TagText = styled.Text({ fontSize: 10, lineHeight: 14, color: colors.primary[700] });
const DetailText = styled.Text({ ...typography.caption2.regular, color: colors.gray[700] });
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
