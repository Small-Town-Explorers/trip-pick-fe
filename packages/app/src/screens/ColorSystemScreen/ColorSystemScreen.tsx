import styled from '@emotion/native';
import { ScrollView, Text, View } from 'react-native';
import { colors } from '../../styles';

type Palette = Readonly<Record<string, string>>;

interface PaletteSectionProps {
  description: string;
  name: string;
  palette: Palette;
}

function isDark(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance < 145;
}

function Swatch({ token, value }: { token: string; value: string }) {
  return (
    <SwatchCard>
      <SwatchColor style={{ backgroundColor: value }}>
        <SwatchScale style={{ color: isDark(value) ? colors.gray[25] : colors.gray[900] }}>
          {token}
        </SwatchScale>
      </SwatchColor>
      <SwatchMeta>
        <SwatchName numberOfLines={1}>{token}</SwatchName>
        <SwatchHex>{value}</SwatchHex>
      </SwatchMeta>
    </SwatchCard>
  );
}

function PaletteSection({ description, name, palette }: PaletteSectionProps) {
  return (
    <Section>
      <SectionHeading>
        <SectionTitle>{name}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
      </SectionHeading>

      <SwatchGrid>
        {Object.entries(palette).map(([token, value]) => (
          <Swatch key={token} token={token} value={value} />
        ))}
      </SwatchGrid>
    </Section>
  );
}

export function ColorSystemScreen() {
  const positive = {
    positive: colors.semantic.positive,
    positiveLight: colors.semantic.positiveLight,
    positiveDisabled: colors.semantic.positiveDisabled,
  };
  const warning = {
    warning: colors.semantic.warning,
    warningLight: colors.semantic.warningLight,
    warningDisabled: colors.semantic.warningDisabled,
  };

  return (
    <Page>
      <Content>
        <Hero>
          <HeroCopy>
            <Eyebrow>TRIP PICK DESIGN SYSTEM</Eyebrow>
            <Title>Color system</Title>
            <HeroDescription>
              서비스의 분위기와 상태를 일관되게 전달하기 위한 공통 컬러 토큰입니다.
            </HeroDescription>
          </HeroCopy>
          <TokenCount>
            <TokenCountDot />
            <TokenCountText>4 palettes · 34 tokens</TokenCountText>
          </TokenCount>
        </Hero>

        <SectionStack>
          <PaletteSection
            description="배경, 경계선, 보조 텍스트와 본문에 사용하는 중립 색상"
            name="Gray"
            palette={colors.gray}
          />
          <PaletteSection
            description="브랜드를 나타내는 핵심 색상과 인터랙션 상태"
            name="Primary"
            palette={colors.primary}
          />
          <PaletteSection
            description="Primary를 보완하는 강조 및 정보 전달 색상"
            name="Sub"
            palette={colors.sub}
          />

          <Section>
            <SectionHeading>
              <SectionTitle>Semantic</SectionTitle>
              <SectionDescription>의미와 상태를 명확하게 전달하는 기능 색상</SectionDescription>
            </SectionHeading>

            <SemanticGrid>
              <SemanticGroup>
                <SemanticTitle>Positive</SemanticTitle>
                <SwatchGrid>
                  {Object.entries(positive).map(([token, value]) => (
                    <Swatch key={token} token={token} value={value} />
                  ))}
                </SwatchGrid>
              </SemanticGroup>

              <SemanticGroup>
                <SemanticTitle>Warning</SemanticTitle>
                <SwatchGrid>
                  {Object.entries(warning).map(([token, value]) => (
                    <Swatch key={token} token={token} value={value} />
                  ))}
                </SwatchGrid>
              </SemanticGroup>
            </SemanticGrid>
          </Section>
        </SectionStack>
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
  color: colors.primary[800],
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 2,
});

const Title = styled(Text)({
  color: colors.gray[1000],
  fontSize: 64,
  fontWeight: '800',
  letterSpacing: -3,
  lineHeight: 70,
});

const HeroDescription = styled(Text)({
  maxWidth: 560,
  marginTop: 8,
  color: colors.gray[700],
  fontSize: 17,
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
  color: colors.gray[800],
  fontSize: 13,
  fontWeight: '700',
});

const SectionStack = styled(View)({
  gap: 56,
});

const Section = styled(View)({
  padding: 36,
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
  marginBottom: 28,
});

const SectionTitle = styled(Text)({
  color: colors.gray[1000],
  fontSize: 26,
  fontWeight: '800',
  letterSpacing: -0.8,
});

const SectionDescription = styled(Text)({
  color: colors.gray[600],
  fontSize: 14,
});

const SwatchGrid = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
});

const SwatchCard = styled(View)({
  width: 132,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: colors.gray[100],
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
});

const SwatchColor = styled(View)({
  minHeight: 118,
  padding: 12,
  alignItems: 'flex-end',
});

const SwatchScale = styled(Text)({
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 0.2,
});

const SwatchMeta = styled(View)({
  padding: 12,
  gap: 5,
});

const SwatchName = styled(Text)({
  color: colors.gray[800],
  fontSize: 12,
  fontWeight: '700',
});

const SwatchHex = styled(Text)({
  color: colors.gray[500],
  fontSize: 11,
});

const SemanticGrid = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 36,
});

const SemanticGroup = styled(View)({
  flexGrow: 1,
  flexBasis: 420,
  gap: 16,
});

const SemanticTitle = styled(Text)({
  color: colors.gray[800],
  fontSize: 14,
  fontWeight: '700',
});
