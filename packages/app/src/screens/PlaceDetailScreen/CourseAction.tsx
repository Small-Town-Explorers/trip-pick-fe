import { IconButton } from '@components/Buttons/Button';
import styled from '@emotion/native';
import { colors, typography } from '@styles';

export function PlaceDetailCourseAction() {
  return (
    <Section>
      <Description>당신만의 고요를 찾아서</Description>
      <IconButton icon="ai">이 코스로 여행 생성하기</IconButton>
    </Section>
  );
}

const Section = styled.View({
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 32,
  gap: 20,
});

const Description = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
