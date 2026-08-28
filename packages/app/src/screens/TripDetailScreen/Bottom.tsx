import { IconComponent, type IconName } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, typography, withAlpha } from '@styles';
import { Platform } from 'react-native';

interface TripDetailActionsProps {
  onChatEdit?: () => void;
  onDirectEdit?: () => void;
  onRegenerate?: () => void;
  onSave?: () => void;
}

export const TripDetailActions = ({
  onChatEdit,
  onDirectEdit,
  onRegenerate,
  onSave,
}: TripDetailActionsProps) => {
  const quickActions: { icon: IconName; label: string; onPress?: () => void }[] = [
    { icon: 'ai', label: '챗봇 수정', onPress: onChatEdit },
    { icon: 'edit', label: '직접 편집', onPress: onDirectEdit },
    { icon: 'retry', label: '다시 생성', onPress: onRegenerate },
  ];

  return (
    <Bar>
      <Actions>
        <QuickRow>
          {quickActions.map((action) => (
            <QuickButton key={action.label} accessibilityRole="button" onPress={action.onPress}>
              <IconComponent name={action.icon} color={colors.primary[600]} />
              <QuickText numberOfLines={1}>{action.label}</QuickText>
            </QuickButton>
          ))}
        </QuickRow>
        <SaveButton accessibilityRole="button" onPress={onSave}>
          <IconComponent name="check_circle" color={colors.primary[300]} />
          <SaveText>저장</SaveText>
        </SaveButton>
      </Actions>
    </Bar>
  );
};

const Bar = styled.View({
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 18,
  backgroundColor: withAlpha('#FFFFFF', 0.7),
  borderTopColor: '#FFFFFF',
  borderTopWidth: 2,
  borderStyle: 'solid',

  ...Platform.select({
    web: {
      position: 'fixed' as never,
      zIndex: 100,

      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: 480,
    },
    default: {
      position: 'absolute',
      zIndex: 100,
    },
  }),

  ...createShadow(0, 0, 30, 0, withAlpha(colors.gray[1000], 0.07)),
});

const Actions = styled.View({
  width: '100%',
  gap: 14,
});

const QuickRow = styled.View({
  width: '100%',
  flexDirection: 'row',
  gap: 12,
});

const QuickButton = styled.Pressable({
  flex: 1,
  minWidth: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  gap: 4,
  backgroundColor: withAlpha('#FFFFFF', 0.85),
  borderWidth: 2,
  borderColor: '#FFFFFF',
  borderRadius: 8,
});

const QuickText = styled.Text({
  flexShrink: 1,
  ...typography.body2.medium,
  color: colors.gray[800],
  textAlign: 'center',
});

const SaveButton = styled.Pressable({
  width: '100%',
  height: 48,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
  gap: 6,
  backgroundColor: colors.primary[1000],
  borderRadius: 8,
});

const SaveText = styled.Text({
  ...typography.body2.medium,
  color: '#FFFFFF',
  textAlign: 'center',
});
