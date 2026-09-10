import LandscapeOne from '@assets/images/mock/landscape/landscape1.png';
import LandscapeTwo from '@assets/images/mock/landscape/landscape2.png';
import type { ImageSourcePropType } from 'react-native';

export type MockVisitedRegion = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type MockPastTrip = {
  id: string;
  regionId: MockVisitedRegion['id'];
  title: string;
  startDate: string;
  endDate: string;
  itemCount: number;
  image: ImageSourcePropType;
};

export const mockVisitedRegions: MockVisitedRegion[] = [
  { id: 'gunsan', name: '군산시', lat: 35.9677, lng: 126.7366 },
  { id: 'damyang', name: '담양군', lat: 35.3214, lng: 126.9882 },
  { id: 'tongyeong', name: '통영시', lat: 34.8544, lng: 128.4332 },
];

export const mockPastTrips: MockPastTrip[] = [
  {
    id: 'past-tongyeong-sea',
    regionId: 'tongyeong',
    title: '통영 낭만 바다 여행',
    startDate: '2026-09-05',
    endDate: '2026-09-06',
    itemCount: 7,
    image: LandscapeOne as ImageSourcePropType,
  },
  {
    id: 'past-damyang-forest',
    regionId: 'damyang',
    title: '담양 대나무숲 힐링 여행',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    itemCount: 7,
    image: LandscapeTwo as ImageSourcePropType,
  },
  {
    id: 'past-gunsan-time',
    regionId: 'gunsan',
    title: '군산 시간여행 감성 코스',
    startDate: '2026-07-12',
    endDate: '2026-07-13',
    itemCount: 7,
    image: LandscapeOne as ImageSourcePropType,
  },
  {
    id: 'past-tongyeong-food',
    regionId: 'tongyeong',
    title: '통영 섬지락 미식 투어',
    startDate: '2026-06-02',
    endDate: '2026-06-03',
    itemCount: 6,
    image: LandscapeTwo as ImageSourcePropType,
  },
];
