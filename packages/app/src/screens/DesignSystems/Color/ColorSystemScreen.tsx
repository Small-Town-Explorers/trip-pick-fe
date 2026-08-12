import { colors } from '../../../styles';
import { DesignSystemLayout, DesignSystemSection } from '../layout';
import {
  Grid,
  SemanticGrid,
  SemanticGroup,
  SemanticTitle,
  SwatchCard,
  SwatchColor,
  SwatchToken,
  SwatchMeta,
  SwatchName,
  SwatchHex,
} from './style';

type Palette = Readonly<Record<string, string>>;

function isDark(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 < 145;
}

export function ColorSystemScreen() {
  return (
    <DesignSystemLayout
      activePage="colors"
      description="서비스의 분위기와 상태를 일관되게 전달하기 위한 공통 컬러 토큰입니다."
      summary="4 palettes · 34 tokens"
      title="Color system"
    >
      <DesignSystemSection
        description="배경, 경계선, 보조 텍스트와 본문에 사용하는 중립 색상"
        title="Gray"
      >
        <SwatchGrid palette={colors.gray} />
      </DesignSystemSection>
      <DesignSystemSection
        description="브랜드를 대표하는 핵심 색상과 인터랙션 상태"
        title="Primary"
      >
        <SwatchGrid palette={colors.primary} />
      </DesignSystemSection>
      <DesignSystemSection description="Primary를 보완하는 강조 및 정보 전달 색상" title="Sub">
        <SwatchGrid palette={colors.sub} />
      </DesignSystemSection>
      <DesignSystemSection description="의미와 상태를 명확하게 전달하는 기능 색상" title="Semantic">
        <SemanticGrid>
          <SemanticGroup>
            <SemanticTitle>Positive</SemanticTitle>
            <SwatchGrid
              palette={{
                positive: colors.semantic.positive,
                positiveLight: colors.semantic.positiveLight,
                positiveDisabled: colors.semantic.positiveDisabled,
              }}
            />
          </SemanticGroup>
          <SemanticGroup>
            <SemanticTitle>Warning</SemanticTitle>
            <SwatchGrid
              palette={{
                warning: colors.semantic.warning,
                warningLight: colors.semantic.warningLight,
                warningDisabled: colors.semantic.warningDisabled,
              }}
            />
          </SemanticGroup>
        </SemanticGrid>
      </DesignSystemSection>
    </DesignSystemLayout>
  );
}

function SwatchGrid({ palette }: { palette: Palette }) {
  return (
    <Grid>
      {Object.entries(palette).map(([token, value]) => (
        <Swatch key={token} token={token} value={value} />
      ))}
    </Grid>
  );
}

function Swatch({ token, value }: { token: string; value: string }) {
  return (
    <SwatchCard>
      <SwatchColor backgroundColor={value}>
        <SwatchToken isDark={isDark(value)}>{token}</SwatchToken>
      </SwatchColor>
      <SwatchMeta>
        <SwatchName numberOfLines={1}>{token}</SwatchName>
        <SwatchHex>{value}</SwatchHex>
      </SwatchMeta>
    </SwatchCard>
  );
}
