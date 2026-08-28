import styled from '@emotion/native';
import { MyPageSectionLayout } from '../SectionLayout';
import { colors, createShadow, typography, withAlpha } from '@styles';

export function MyPagePrivacyScreen() {
  return (
    <MyPageSectionLayout title="개인정보처리방침">
      <Section>
        <Card>
          <Article>
            <ArticleTitle>코스 편집 개인정보처리방침</ArticleTitle>
            <ArticleDate>시행일자: 2025년 9월 1일</ArticleDate>
          </Article>
          <Article>
            <ArticleHeading>1. 개인정보의 수집 및 이용 목적</ArticleHeading>
            <ArticleText>
              본 서비스는 원활한 서비스 제공을 위해 아래와 같은 목적으로 개인정보를 수집 및
              이용합니다.{`\n\n`}
              <ArticleStrong>회원 가입 및 관리: </ArticleStrong>
              회원제 서비스 이용에 따른 본인 확인, 개인 식별, 불량 회원의 부정 이용 방지 및 비인가
              사용 방지, 가입 의사 확인, 연령 확인.{`\n\n`}
              <ArticleStrong>서비스 제공 및 요금 정산: </ArticleStrong>
              콘텐츠 제공, 맞춤형 서비스 제공, 구매 및 요금 결제, 요금 추심.
            </ArticleText>
          </Article>
          <Article>
            <ArticleHeading>2. 수집하는 개인정보의 항목 및 수집 방법</ArticleHeading>
            <ArticleText>
              본 서비스는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고
              있습니다.{`\n\n`}
              <ArticleStrong>수집 항목: </ArticleStrong>
              이름, 이메일 주소, 비밀번호, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보{`\n\n`}
              <ArticleStrong>수집 방법: </ArticleStrong>
              홈페이지(회원가입), 서면 양식, 전화/팩스를 통한 회원가입, 생성정보 수집 툴을 통한 수집
            </ArticleText>
          </Article>
          <Article>
            <ArticleHeading>3. 개인정보의 보유 및 이용 기간</ArticleHeading>
            <ArticleText>
              원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이
              파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 아래와 같이 일정 기간
              보관합니다.
            </ArticleText>
          </Article>
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

const ArticleTitle = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
});

const ArticleHeading = styled.Text({
  ...typography.body1.semibold,
  color: colors.gray[1000],
});

const ArticleText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[800],
});

const ArticleDate = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[500],
});

const ArticleStrong = styled.Text({
  ...typography.body3.semibold,
  color: colors.gray[800],
});
