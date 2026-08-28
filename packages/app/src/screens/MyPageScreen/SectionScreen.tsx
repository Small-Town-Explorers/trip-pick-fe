import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { Switch } from 'react-native';
import { useAppNavigation } from '../../navigation';

export type MyPageSection = 'account' | 'notifications' | 'notices' | 'faq' | 'terms' | 'privacy';
const titles: Record<MyPageSection, string> = {
  account: '계정 정보',
  notifications: '알림 설정',
  notices: '공지사항',
  faq: '자주 묻는 질문 (FAQ)',
  terms: '이용 약관',
  privacy: '개인정보 처리방침',
};

export function MyPageSectionScreen({ section }: { section: MyPageSection }) {
  const { back } = useAppNavigation();
  const [enabled, setEnabled] = useState(true);
  const title = titles[section];
  return (
    <Screen>
      <Header>
        <Back accessibilityRole="button" onPress={back}>
          <IconComponent name="carousel_left" color={colors.gray[400]} />
        </Back>
        <Title>{title}</Title>
        <Spacer />
      </Header>
      <Scroll contentContainerStyle={contentStyle}>
        {section === 'account' ? (
          <>
            <Card>
              <Label>이름</Label>
              <Value>김민수</Value>
            </Card>
            <Card>
              <Label>연결된 이메일</Label>
              <Value>user@email.com</Value>
            </Card>
            <Card>
              <Label>연결 서비스</Label>
              <Value>카카오 로그인</Value>
            </Card>
          </>
        ) : null}
        {section === 'notifications' ? (
          <>
            <Setting>
              <Value>여행 알림</Value>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ true: colors.primary[600] }}
              />
            </Setting>
            <Setting>
              <Value>마케팅 정보 수신</Value>
              <Switch value={false} />
            </Setting>
          </>
        ) : null}
        {section === 'notices'
          ? [
              '[공지] 가을 여행 테마 업데이트 안내',
              '[안내] 개인정보 처리방침 변경 사전 안내',
              '[이벤트] 소도시 여행 후기 작성 이벤트',
            ].map((item) => (
              <Row key={item}>
                <Value>{item}</Value>
                <IconComponent name="carousel_right" color={colors.gray[300]} />
              </Row>
            ))
          : null}
        {section === 'faq'
          ? [
              '코스 편집은 어떻게 하나요?',
              '저장한 코스는 어디에서 확인하나요?',
              '추천 장소를 변경할 수 있나요?',
            ].map((item) => (
              <Row key={item}>
                <Value>{item}</Value>
                <IconComponent name="carousel_right" color={colors.gray[300]} />
              </Row>
            ))
          : null}
        {section === 'terms' || section === 'privacy' ? (
          <Document>
            <DocTitle>{title}</DocTitle>
            <DocText>
              소도시로 서비스를 이용해 주셔서 감사합니다.{`\n\n`}본 문서는 서비스 이용 및 개인정보
              보호에 관한 기본 내용을 안내하기 위한 임시 화면입니다. 실제 정책 문구는 운영 정책 확정
              후 반영됩니다.
            </DocText>
          </Document>
        ) : null}
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, backgroundColor: colors.gray[25] });
const Header = styled.View({
  height: 64,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[100],
});
const Back = styled.Pressable({ width: 24, height: 24 });
const Spacer = styled.View({ width: 24 });
const Title = styled.Text({ ...typography.heading4.semibold, color: colors.gray[1000] });
const Scroll = styled.ScrollView({ flex: 1 });
const contentStyle = { padding: 20, gap: 12 } as const;
const Card = styled.View({ padding: 16, gap: 8, backgroundColor: '#FFFFFF', borderRadius: 10 });
const Label = styled.Text({ ...typography.caption1.regular, color: colors.gray[500] });
const Value = styled.Text({ ...typography.body2.regular, color: colors.gray[800] });
const Setting = styled.View({
  height: 60,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});
const Row = styled.Pressable({
  minHeight: 60,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});
const Document = styled.View({
  padding: 20,
  gap: 20,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
});
const DocTitle = styled.Text({ ...typography.heading4.semibold, color: colors.gray[1000] });
const DocText = styled.Text({ ...typography.body2.regular, color: colors.gray[700] });
