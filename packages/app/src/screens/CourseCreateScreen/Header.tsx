import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useAppNavigation } from '../../navigation';

export function CourseCreateHeader() {
  const { back } = useAppNavigation();

  return (
    <Header>
      <BackButton accessibilityRole="button" accessibilityLabel="뒤로 가기" onPress={back}>
        <IconComponent name="carousel_left" color={colors.gray[400]} />
      </BackButton>
      <Title>코스 생성</Title>
      <HeaderSpacer />
    </Header>
  );
}

const Header = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(8, 25, 29, 0.1)',
});

const BackButton = styled.Pressable({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled.Text({
  ...typography.heading2.medium,
  color: colors.gray[1000],
});

const HeaderSpacer = styled.View({
  width: 24,
  height: 24,
});
