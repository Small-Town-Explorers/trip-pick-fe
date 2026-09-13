import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { MyPageSectionLayout } from '../SectionLayout';

type Category = 'course' | 'route' | 'save' | 'guide';

const categories: { id: Category; label: string }[] = [
  { id: 'course', label: '코스 생성' },
  { id: 'route', label: '동선·장소' },
  { id: 'save', label: '저장·계정' },
  { id: 'guide', label: '이용 안내' },
];

const faqs = {
  course: [
    {
      question: 'AI 코스는 어떻게 생성되나요?',
      answer:
        'AI 코스는 사용자가 입력한 취향, 방문 목적, 동행자 정보 등을 바탕으로 빅데이터를 분석하여 최적의 동선을 제안합니다. 소도시의 숨겨진 명소와 지역 주민들이 추천하는 장소들을 우선적으로 배치하여 독창적인 여행 경험을 제공하도록 설계되었습니다.',
    },
    {
      question: '코스를 만들려면 어떤 정보를 입력해야 하나요?',
      answer:
        '여행 지역과 일정, 동행자, 선호하는 여행 스타일을 선택하면 코스가 생성됩니다. 입력한 정보가 구체적일수록 취향에 가까운 결과를 받아볼 수 있습니다.',
    },
    {
      question: '코스 생성에는 얼마나 걸리나요?',
      answer:
        '입력을 완료하면 보통 1분 이내에 코스가 완성됩니다. 일정이 길거나 요청 사항이 많은 경우 시간이 조금 더 소요될 수 있습니다.',
    },
    {
      question: '몇 박 며칠까지 코스를 만들 수 있나요?',
      answer:
        '당일치기부터 여러 날 일정까지 생성할 수 있습니다. 하루에 무리한 일정이 들어가지 않도록 이동 시간을 고려해 장소 수를 조절합니다.',
    },
    {
      question: '특정 테마(예: 카페 투어)로 코스를 짤 수 있나요?',
      answer:
        '여행 스타일과 요청 사항에 원하는 테마를 입력하면 해당 취향을 반영한 코스를 추천받을 수 있습니다.',
    },
    {
      question: '같은 지역으로 코스를 다시 만들면 결과가 달라지나요?',
      answer:
        '입력한 취향과 일정이 같아도 매번 동일한 코스가 나오지는 않습니다. 여러 번 생성해 비교한 뒤 마음에 드는 코스를 저장하셔도 좋습니다.',
    },
    {
      question: '소도시가 아닌 지역도 코스를 만들 수 있나요?',
      answer:
        '서비스는 소도시 중심으로 장소를 추천하도록 설계되어 있습니다. 대도시를 선택하면 도심보다는 근교와 골목 단위의 장소가 우선 제안됩니다.',
    },
  ],
  route: [
    {
      question: '생성된 코스를 수정할 수 있나요?',
      answer:
        '코스 생성 결과에서 챗봇 수정 또는 직접 편집 기능을 이용해 장소와 일정을 변경할 수 있습니다.',
    },
    {
      question: '추천된 장소가 마음에 들지 않으면 어떻게 하나요?',
      answer:
        '개별 장소를 삭제하거나 다른 장소로 교체할 수 있습니다. 교체 시 남은 일정의 동선도 함께 다시 정리됩니다.',
    },
    {
      question: '추천 장소 사이의 이동은 어떻게 확인하나요?',
      answer:
        '코스 결과의 지도에서 장소 간 순서와 이동 경로를 확인할 수 있습니다. 이동 수단과 소요 시간도 함께 표시됩니다.',
    },
    {
      question: '대중교통만 이용해도 다닐 수 있는 코스인가요?',
      answer:
        '이동 수단을 선택하면 해당 조건에 맞게 동선이 구성됩니다. 대중교통 편이 적은 지역은 이동 시간이 길어질 수 있어 미리 확인하시는 것을 권장합니다.',
    },
    {
      question: '식당이나 카페도 코스에 포함되나요?',
      answer:
        '이동 동선과 식사 시간을 고려해 함께 배치됩니다. 특정 음식이나 분위기를 요청하면 해당 조건을 반영해 추천합니다.',
    },
    {
      question: '추천 장소의 정보는 최신인가요?',
      answer:
        '장소 정보는 제휴 데이터와 지도 정보를 바탕으로 제공되며, 방문 전 운영 시간을 다시 확인하는 것을 권장합니다.',
    },
  ],
  save: [
    {
      question: '로그인하지 않아도 코스를 만들 수 있나요?',
      answer:
        '코스 생성은 가능하지만 저장과 다시 보기는 로그인 후 이용할 수 있습니다. 카카오톡으로 간편하게 시작할 수 있습니다.',
    },
    {
      question: '만든 코스는 어디에서 다시 볼 수 있나요?',
      answer:
        '상단의 내 여행 메뉴에서 저장한 코스를 언제든 확인할 수 있습니다. 여행 날짜가 가까운 순서로 정리됩니다.',
    },
    {
      question: '코스를 일행과 함께 볼 수 있나요?',
      answer:
        '저장한 코스는 링크로 공유할 수 있습니다. 링크를 받은 사람은 별도 로그인 없이 일정과 지도를 확인할 수 있습니다.',
    },
  ],
  guide: [
    {
      question: '코스에 포함된 장소를 바로 예약할 수 있나요?',
      answer:
        '현재는 장소 추천과 동선 안내까지 제공하며, 예약은 각 장소의 안내에 따라 별도로 진행해 주셔야 합니다.',
    },
    {
      question: '서비스 이용은 무료인가요?',
      answer:
        '코스 생성과 저장은 무료로 이용할 수 있습니다. 이동과 입장에 드는 실제 비용은 여행자 부담입니다.',
    },
    {
      question: '추천이 잘못되었거나 없어진 장소를 발견했어요.',
      answer:
        '코스 화면의 신고 기능으로 알려주시면 확인 후 반영합니다. 보내주신 내용은 이후 추천 품질을 개선하는 데 사용됩니다.',
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
