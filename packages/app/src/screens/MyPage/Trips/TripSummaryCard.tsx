import styled from '@emotion/native';
import { colors, shadows, typography } from '@styles';
import type { PastTrip } from '../../../controllers';

const formatDate = (date: string) => date.split('-').map(Number).join('.');

export function TripSummaryCard({ trip, onPress }: { trip: PastTrip; onPress?: () => void }) {
  return (
    <Card accessibilityRole={onPress ? 'button' : undefined} onPress={onPress}>
      <Thumbnail source={{ uri: trip.imageUrl ?? undefined }} resizeMode="cover" />
      <Body>
        <Title numberOfLines={1}>{trip.title}</Title>
        <Period>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Period>
        <SpotCount>{trip.itemCount}개의 스팟</SpotCount>
      </Body>
    </Card>
  );
}

const Card = styled.Pressable({
  width: '100%',
  minHeight: 111,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  ...shadows[2],
});

const Thumbnail = styled.Image({
  width: 87,
  height: 79,
  borderRadius: 8,
  backgroundColor: colors.gray[100],
});

const Body = styled.View({ flex: 1, gap: 7 });
const Title = styled.Text({ ...typography.body2.semibold, color: colors.gray[1000] });
const Period = styled.Text({ ...typography.body3.medium, color: colors.gray[600] });
const SpotCount = styled.Text({
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 5,
  ...typography.caption2.medium,
  color: colors.primary[700],
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
});
