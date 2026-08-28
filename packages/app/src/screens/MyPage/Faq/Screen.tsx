import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { MyPageSectionLayout } from '../SectionLayout';

type Category = 'course' | 'save' | 'account';

const categories: { id: Category; label: string }[] = [
  { id: 'course', label: '코스 생성' },
  { id: 'save', label: '저장/공유' },
  { id: 'account', label: '계정' },
];

const faqs = {
  course: [
    {
      question: 'AI 코스는 어떻게 생성되나요?',
      answer:
        'AI 코스는 사용자가 입력한 취향, 방문 목적, 동행자 정보 등을 바탕으로 빅데이터를 분석하여 최적의 동선을 제안합니다. 소도시의 숨겨진 명소와 지역 주민들이 추천하는 장소들을 우선적으로 배치하여 독창적인 여행 경험을 제공하도록 설계되었습니다.',
    },
    {
      question: '생성된 코스를 수정할 수 있나요?',
      answer:
        '코스 생성 결과에서 챗봇 수정 또는 직접 편집 기능을 이용해 장소와 일정을 변경할 수 있습니다.',
    },
    {
      question: '추천 장소의 정보는 최신인가요?',
      answer:
        '장소 정보는 제휴 데이터와 지도 정보를 바탕으로 제공되며, 방문 전 운영 시간을 다시 확인하는 것을 권장합니다.',
    },
    {
      question: '특정 테마(예: 카페 투어)로 코스를 짤 수 있나요?',
      answer:
        '여행 스타일과 요청 사항에 원하는 테마를 입력하면 해당 취향을 반영한 코스를 추천받을 수 있습니다.',
    },
  ],
  save: [
    {
      question: '생성한 코스는 어디에 저장되나요?',
      answer: '저장한 여행 코스는 내 여행의 선택한 보관함에서 다시 확인할 수 있습니다.',
    },
    {
      question: '여행 코스를 다른 사람에게 공유할 수 있나요?',
      answer: '코스 결과 화면의 공유 버튼을 통해 카카오톡이나 카카오맵으로 공유할 수 있습니다.',
    },
  ],
  account: [
    {
      question: '연결된 이메일을 변경할 수 있나요?',
      answer: '계정 정보 화면에서 연결된 이메일 옆의 수정 버튼을 눌러 변경할 수 있습니다.',
    },
    {
      question: '서비스 탈퇴는 어디에서 하나요?',
      answer: '계정 정보 화면 하단의 서비스 탈퇴 메뉴에서 진행할 수 있습니다.',
    },
  ],
} satisfies Record<Category, { question: string; answer: string }[]>;

export function MyPageFaqScreen() {
  const [category, setCategory] = useState<Category>('course');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    setOpenIndex(nextCategory === 'course' ? 0 : null);
  };

  return (
    <MyPageSectionLayout title="자주 묻는 질문 (FAQ)">
      <Section>
        <Tabs>
          {categories.map((item) => (
            <Tab
              key={item.id}
              active={category === item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: category === item.id }}
              onPress={() => selectCategory(item.id)}
            >
              <TabLabel active={category === item.id}>{item.label}</TabLabel>
            </Tab>
          ))}
        </Tabs>

        <Questions>
          {faqs[category].map((faq, index) => {
            const expanded = openIndex === index;
            return (
              <QuestionCard key={faq.question}>
                <QuestionButton
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() => setOpenIndex(expanded ? null : index)}
                >
                  <Question>{faq.question}</Question>
                  <Arrow expanded={expanded}>
                    <IconComponent name="carousel_right" size={20} color={colors.gray[400]} />
                  </Arrow>
                </QuestionButton>
                {expanded && <Answer>{faq.answer}</Answer>}
              </QuestionCard>
            );
          })}
        </Questions>
      </Section>
    </MyPageSectionLayout>
  );
}

const Section = styled.View({
  width: '100%',
  paddingTop: 28,
  gap: 16,
  paddingHorizontal: 20,
  paddingBottom: 12,
});

const Tabs = styled.View({
  width: '100%',
  height: 40,
  flexDirection: 'row',
});

const Tab = styled.Pressable<{ active: boolean }>(({ active }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingBottom: 16,
  borderBottomWidth: active ? 2 : 1,
  borderBottomColor: active ? colors.gray[900] : colors.gray[200],
}));

const TabLabel = styled.Text<{ active: boolean }>(({ active }) => ({
  ...typography.body2[active ? 'medium' : 'regular'],
  color: active ? colors.gray[1000] : colors.gray[600],
}));

const Questions = styled.View({
  width: '100%',
  gap: 16,
});

const QuestionCard = styled.View({
  width: '100%',
  padding: 20,
  gap: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.05)),
});
const QuestionButton = styled.Pressable({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
});

const Question = styled.Text({
  flex: 1,
  ...typography.body1.medium,
  color: colors.gray[1000],
});

const Arrow = styled.View<{ expanded: boolean }>(({ expanded }) => ({
  width: 20,
  height: 20,
  transform: [{ rotate: expanded ? '-90deg' : '90deg' }],
}));

const Answer = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
});
