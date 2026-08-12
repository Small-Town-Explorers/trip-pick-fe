import { typography, typographyMetrics, type TypographyStyle } from '../../../styles';
import { DesignSystemLayout, DesignSystemSection } from '../layout';
import {
  TableScroll,
  Table,
  TableRow,
  TableColumn,
  TableHeaderText,
  SampleName,
  ValueText,
  WeightText,
  PreviewSection,
  PreviewMeta,
  PreviewTitle,
  PreviewLabel,
  PreviewCopy,
  PreviewHeading,
  PreviewBody,
  PreviewCaption,
} from './style';

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

export function TypographySystemScreen() {
  return (
    <DesignSystemLayout
      activePage="typography"
      description="Pretendard를 기반으로 서비스의 정보 위계와 읽기 흐름을 일관되게 구성합니다."
      summary="Pretendard · 10 styles"
      title="Typography system"
    >
      <DesignSystemSection description="행간 135% · 자간 1%" title="Type scale">
        <TableScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Table>
            <TableRow header>
              <TableColumn type="name">
                <TableHeaderText>명칭</TableHeaderText>
              </TableColumn>
              <TableColumn type="size">
                <TableHeaderText>크기</TableHeaderText>
              </TableColumn>
              <TableColumn type="weight">
                <TableHeaderText>굵기</TableHeaderText>
              </TableColumn>
              <TableColumn type="lineHeight">
                <TableHeaderText>행간</TableHeaderText>
              </TableColumn>
              <TableColumn type="letterSpacing">
                <TableHeaderText>자간</TableHeaderText>
              </TableColumn>
            </TableRow>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableColumn type="name">
                  <SampleName style={row.weights[0].style}>{row.name}</SampleName>
                </TableColumn>
                <TableColumn type="size">
                  <ValueText>{row.size}</ValueText>
                </TableColumn>
                <TableColumn type="weight">
                  {row.weights.map(({ label, style }) => (
                    <WeightText key={label} style={style}>
                      {label}
                    </WeightText>
                  ))}
                </TableColumn>
                <TableColumn type="lineHeight">
                  <ValueText>{typographyMetrics.lineHeightRatio * 100}%</ValueText>
                </TableColumn>
                <TableColumn type="letterSpacing">
                  <ValueText>{typographyMetrics.letterSpacingRatio * 100}%</ValueText>
                </TableColumn>
              </TableRow>
            ))}
          </Table>
        </TableScroll>
      </DesignSystemSection>
      <PreviewSection>
        <PreviewMeta>
          <PreviewTitle>Preview</PreviewTitle>
          <PreviewLabel>Pretendard Semibold · Medium · Regular</PreviewLabel>
        </PreviewMeta>
        <PreviewCopy>
          <PreviewHeading>여행을 고르는 시간부터 설레도록</PreviewHeading>
          <PreviewBody>
            Trip Pick은 취향에 맞는 여행지를 발견하고, 함께 떠날 사람과 계획을 나누는 경험을
            만듭니다.
          </PreviewBody>
          <PreviewCaption>가볍게 둘러보고 마음에 드는 여행을 저장해 보세요.</PreviewCaption>
        </PreviewCopy>
      </PreviewSection>
    </DesignSystemLayout>
  );
}
