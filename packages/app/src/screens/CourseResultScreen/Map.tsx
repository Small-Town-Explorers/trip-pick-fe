import { KakaoRouteMap } from '@components/KakaoMap';
import { useMemo } from 'react';
import type { CoursePlaces } from './Routine';

export function CourseResultMap({ places }: { places: CoursePlaces }) {
  const coordinates = useMemo(
    () => places.map((day) => day.map(({ lat, lng }) => ({ lat, lng }))),
    [places],
  );
  return <KakaoRouteMap coordinates={coordinates} height={240} />;
}
