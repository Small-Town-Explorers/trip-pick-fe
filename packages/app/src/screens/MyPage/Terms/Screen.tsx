import styled from '@emotion/native';
import { MyPageSectionLayout } from '../SectionLayout';
import { colors, createShadow, typography, withAlpha } from '@styles';

const terms = [
  {
    title: '제1조(목적)',
    content:
      '본 약관은 회사가 제공하는 모든 서비스의 이용조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조(용어의 정의)',
    content:
      '본 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n\n"서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 회사의 제반 서비스를 의미합니다.\n\n"회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.\n\n"아이디(ID)"라 함은 "회원"의 식별과 "서비스" 이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자와 숫자의 조합을 의미합니다.',
  },
  {
    title: '제3조(약관의 효력 및 변경)',
    content:
      '회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.\n\n회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있으며, 개정 시에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다.',
  },
  {
    title: '제4조(개인정보보호 의무)',
    content:
      '"회사"는 "정보통신망법" 등 관계 법령이 정하는 바에 따라 "회원"의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 "회사"의 개인정보 처리방침이 적용됩니다.',
  },
];

export function MyPageTermsScreen() {
  return (
    <MyPageSectionLayout title="이용 약관">
      <Section>
        <Card>
          {terms.map((term, i) => (
            <Article key={i}>
              <ArticleHeading>{term.title}</ArticleHeading>
              <ArticleText>{term.content}</ArticleText>
            </Article>
          ))}
        </Card>
      </Section>
    </MyPageSectionLayout>
  );
}

const Section = styled.View({
  paddingTop: 28,
  paddingHorizontal: 20,
  paddingBottom: 12,
});

const Card = styled.View({
  width: '100%',
  marginTop: 8,
  padding: 20,
  gap: 40,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[50],

  ...createShadow(0, 0, 20, 0, withAlpha(colors.gray[1000], 0.05)),
});

const Article = styled.View({ width: '100%', gap: 16 });

export const ArticleHeading = styled.Text({
  ...typography.body1.semibold,
  color: colors.gray[1000],
});

export const ArticleText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[800],
});
