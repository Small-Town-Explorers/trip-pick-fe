import { CourseResultScreen } from '../CourseResultScreen';

type Props = {
  tripId: string;
};

export function TripDetailScreen({ tripId }: Props) {
  return <CourseResultScreen courseId={tripId} headerTitle="내 여행 상세" />;
}
