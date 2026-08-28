import styled from '@emotion/native';

interface ToggleButtonProps {
  value: boolean;
  onToggle: () => void;
}

export const ToggleButton = ({ value, onToggle }: ToggleButtonProps) => {
  return (
    <Button
      isOn={value}
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Circle isOn={value} />
    </Button>
  );
};

const Button = styled.Pressable<{ isOn: boolean }>(({ isOn }) => ({
  position: 'relative',

  width: 44,
  height: 24,

  borderRadius: 12,
  backgroundColor: isOn ? '#10BC2E' : '#D9D9D9',
  transition: 'background-color 0.1s ease-in-out',
}));

const Circle = styled.View<{ isOn: boolean }>(({ isOn }) => ({
  position: 'absolute',

  width: 20,
  height: 20,

  top: 2,
  left: isOn ? 22 : 2,
  transition: 'left 0.1s ease-in-out',

  backgroundColor: '#FFFFFF',
  borderRadius: 10,
}));
