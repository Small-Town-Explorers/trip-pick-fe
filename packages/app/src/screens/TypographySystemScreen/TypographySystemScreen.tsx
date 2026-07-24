import styled from '@emotion/native';
import { ScrollView, Text, View } from 'react-native';
import { colors, typography, type TypographyStyle } from '../../styles';

interface WeightOption {
  label: string;
  style: TypographyStyle;
}

interface TypographyRow {
  name: string;
  size: number;
  weights: WeightOption[];
}

const rows: TypographyRow[] = [
  {
    name: 'Heading 1',
    size: 28,
    weights: [{ label: 'Semibold', style: typography.heading1.semibold }],
  },
  {
    name: 'Heading 2',
    size: 24,
    weights: [
      { label: 'Semibold', style: typography.heading2.semibold },
      { label: 'Medium', style: typography.heading2.medium },
    ],
  },
  {
    name: 'Heading 3',
    size: 22,
    weights: [
      { label: 'Semibold', style: typography.heading3.semibold },
      { label: 'Medium', style: typography.heading3.medium },
    ],
  },
  {
    name: 'Heading 4',
    size: 22,
    weights: [
      { label: 'Semibold', style: typography.heading4.semibold },
      { label: 'Medium', style: typography.heading4.medium },
    ],
  },
  {
    name: 'Body 1',
    size: 18,
    weights: [
      { label: 'Semibold', style: typography.body1.semibold },
      { label: 'Medium', style: typography.body1.medium },
      { label: 'Regular', style: typography.body1.regular },
    ],
  },
  {
    name: 'Body 2',
    size: 16,
    weights: [
      { label: 'Semibold', style: typography.body2.semibold },
      { label: 'Medium', style: typography.body2.medium },
      { label: 'Regular', style: typography.body2.regular },
    ],
  },
  {
    name: 'Body 3',
    size: 14,
    weights: [
      { label: 'Semibold', style: typography.body3.semibold },
      { label: 'Medium', style: typography.body3.medium },
      { label: 'Regular', style: typography.body3.regular },
    ],
  },
  {
    name: 'Caption 1',
    size: 12,
    weights: [
      { label: 'Medium', style: typography.caption1.medium },
      { label: 'Regular', style: typography.caption1.regular },
    ],
  },
  {
    name: 'Caption 2',
    size: 11,
    weights: [
      { label: 'Medium', style: typography.caption2.medium },
      { label: 'Regular', style: typography.caption2.regular },
    ],
  },
  {
    name: 'Caption 3',
    size: 10,
    weights: [
      { label: 'Medium', style: typography.caption3.medium },
      { label: 'Regular', style: typography.caption3.regular },
    ],
  },
];

function WeightList({ weights }: { weights: WeightOption[] }) {
  return (
    <WeightStack>
      {weights.map(({ label, style }) => (
        <WeightName
          key={label}
          style={{
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
          }}
        >
          {label}
        </WeightName>
      ))}
    </WeightStack>
  );
}

export function TypographySystemScreen() {
  return (
    <Page>
      <Content>
        <Hero>
          <HeroCopy>
            <Eyebrow>TRIP PICK DESIGN SYSTEM</Eyebrow>
            <Title>Typography system</Title>
            <HeroDescription>
              Pretendard를 기반으로 서비스의 정보 위계와 읽기 흐름을 일관되게 구성합니다.
            </HeroDescription>
          </HeroCopy>

          <TokenCount>
            <TokenCountDot />
            <TokenCountText>Pretendard · 10 styles</TokenCountText>
          </TokenCount>
        </Hero>

        <Section>
          <SectionHeading>
            <SectionTitle>Type scale</SectionTitle>
            <SectionDescription>행간 135% · 자간 1%</SectionDescription>
          </SectionHeading>

          <TableScroll horizontal showsHorizontalScrollIndicator={false}>
            <Table>
              <TableHeader>
                <NameColumn>
                  <HeaderText>명칭</HeaderText>
                </NameColumn>
                <SizeColumn>
                  <HeaderText>크기</HeaderText>
                </SizeColumn>
                <WeightColumn>
                  <HeaderText>굵기</HeaderText>
                </WeightColumn>
                <MetricColumn>
                  <HeaderText>행간</HeaderText>
                </MetricColumn>
                <MetricColumn>
                  <HeaderText>자간</HeaderText>
                </MetricColumn>
              </TableHeader>

              {rows.map((row) => (
                <TableRow key={row.name}>
                  <NameColumn>
                    <SampleName style={row.weights[0].style}>{row.name}</SampleName>
                  </NameColumn>
                  <SizeColumn>
                    <ValueText>{row.size}</ValueText>
                  </SizeColumn>
                  <WeightColumn>
                    <WeightList weights={row.weights} />
                  </WeightColumn>
                  <MetricColumn>
                    <ValueText>135%</ValueText>
                  </MetricColumn>
                  <MetricColumn>
                    <ValueText>1%</ValueText>
                  </MetricColumn>
                </TableRow>
              ))}
            </Table>
          </TableScroll>
        </Section>

        <PreviewSection>
          <PreviewMeta>
            <SectionTitle>Preview</SectionTitle>
            <PreviewLabel>Pretendard Semibold · Medium · Regular</PreviewLabel>
          </PreviewMeta>
          <PreviewCopy>
            <PreviewHeading>여행을 고르는 순간부터 설레도록</PreviewHeading>
            <PreviewBody>
              Trip Pick은 취향에 맞는 여행지를 발견하고, 함께 떠날 사람과 계획을 나누는 경험을
              만듭니다.
            </PreviewBody>
            <PreviewCaption>가볍게 둘러보고 마음에 드는 여행을 저장해 보세요.</PreviewCaption>
          </PreviewCopy>
        </PreviewSection>
      </Content>
    </Page>
  );
}

const Page = styled(ScrollView)({
  flex: 1,
  backgroundColor: colors.gray[25],
});

const Content = styled(View)({
  width: '100%',
  maxWidth: 1536,
  marginHorizontal: 'auto',
  paddingHorizontal: 32,
  paddingTop: 72,
  paddingBottom: 120,
});

const Hero = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 32,
  marginBottom: 72,
});

const HeroCopy = styled(View)({
  flexShrink: 1,
  gap: 14,
});

const Eyebrow = styled(Text)({
  ...typography.caption1.medium,
  color: colors.primary[800],
  letterSpacing: 2,
});

const Title = styled(Text)({
  fontFamily: typography.heading1.semibold.fontFamily,
  color: colors.gray[1000],
  fontSize: 64,
  fontWeight: typography.heading1.semibold.fontWeight,
  letterSpacing: -2,
  lineHeight: 72,
});

const HeroDescription = styled(Text)({
  ...typography.body1.regular,
  maxWidth: 560,
  marginTop: 8,
  color: colors.gray[700],
  lineHeight: 29,
});

const TokenCount = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 9,
  paddingHorizontal: 15,
  paddingVertical: 11,
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 999,
  backgroundColor: '#FFFFFF',
});

const TokenCountDot = styled(View)({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.primary[600],
});

const TokenCountText = styled(Text)({
  ...typography.body3.semibold,
  color: colors.gray[800],
});

const Section = styled(View)({
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 28,
  backgroundColor: '#FFFFFF',
});

const SectionHeading = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  padding: 36,
});

const SectionTitle = styled(Text)({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
});

const SectionDescription = styled(Text)({
  ...typography.body3.regular,
  color: colors.gray[600],
});

const TableScroll = styled(ScrollView)({
  borderTopWidth: 1,
  borderTopColor: colors.gray[100],
});

const Table = styled(View)({
  width: '100%',
  minWidth: 920,
});

const TableHeader = styled(View)({
  minHeight: 72,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 36,
  backgroundColor: colors.gray[50],
});

const TableRow = styled(View)({
  minHeight: 148,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 36,
  borderTopWidth: 1,
  borderTopColor: colors.gray[100],
});

const NameColumn = styled(View)({
  width: 340,
  paddingRight: 24,
});

const SizeColumn = styled(View)({
  width: 110,
});

const WeightColumn = styled(View)({
  width: 190,
});

const MetricColumn = styled(View)({
  width: 130,
});

const HeaderText = styled(Text)({
  ...typography.body3.semibold,
  color: colors.gray[600],
});

const SampleName = styled(Text)({
  color: colors.gray[1000],
});

const ValueText = styled(Text)({
  ...typography.body2.medium,
  color: colors.gray[800],
});

const WeightStack = styled(View)({
  gap: 5,
});

const WeightName = styled(Text)({
  fontSize: 16,
  lineHeight: 22,
  color: colors.gray[900],
});

const PreviewSection = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 48,
  marginTop: 40,
  padding: 40,
  borderRadius: 28,
  backgroundColor: colors.primary[1100],
});

const PreviewMeta = styled(View)({
  minWidth: 240,
  gap: 10,
});

const PreviewLabel = styled(Text)({
  ...typography.caption1.regular,
  color: colors.primary[300],
});

const PreviewCopy = styled(View)({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 520,
  gap: 14,
});

const PreviewHeading = styled(Text)({
  ...typography.heading1.semibold,
  color: '#FFFFFF',
});

const PreviewBody = styled(Text)({
  ...typography.body1.regular,
  color: colors.primary[100],
});

const PreviewCaption = styled(Text)({
  ...typography.caption1.medium,
  marginTop: 8,
  color: colors.sub[300],
});
