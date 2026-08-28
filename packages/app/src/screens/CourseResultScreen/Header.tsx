import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useAppNavigation } from '../../navigation';

interface CourseResultHeaderProps {
  editing?: boolean;
  onBack?: () => void;
  onShare: () => void;
}

export function CourseResultHeader({ editing = false, onBack, onShare }: CourseResultHeaderProps) {
  const { back } = useAppNavigation();

  return (
    <Header>
      <IconButton
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        onPress={onBack ?? back}
      >
        <IconComponent name="carousel_left" color={colors.gray[400]} />
      </IconButton>
      <Title>{editing ? '코스 직접 편집' : '코스 생성 결과'}</Title>
      {editing ? (
        <HeaderSpacer />
      ) : (
        <IconButton accessibilityRole="button" accessibilityLabel="공유하기" onPress={onShare}>
          <IconComponent name="share" color={colors.gray[900]} />
        </IconButton>
      )}
    </Header>
  );
}

const Header = styled.View({
  width: '100%',
  height: 64,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(8, 25, 29, 0.1)',
});

const IconButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});
const HeaderSpacer = styled.View({ width: 24, height: 24 });

const Title = styled.Text({
  ...typography.heading2.medium,
  color: colors.gray[1000],
  textAlign: 'center',
});
