import ActivityImage from '@assets/images/place_categories/activity.png';
import CafeImage from '@assets/images/place_categories/cafe.png';
import EtcImage from '@assets/images/place_categories/etc.png';
import HistoricalImage from '@assets/images/place_categories/historical.png';
import LandmarkImage from '@assets/images/place_categories/landmark.png';
import LodgingImage from '@assets/images/place_categories/lodging.png';
import RestaurantImage from '@assets/images/place_categories/restaurant.png';
import type { ImageSourcePropType } from 'react-native';
import type { CourseCategoryTag } from '../controllers';

const categoryImages: Record<CourseCategoryTag, ImageSourcePropType> = {
  맛집: RestaurantImage as unknown as ImageSourcePropType,
  카페: CafeImage as unknown as ImageSourcePropType,
  '관광 명소': LandmarkImage as unknown as ImageSourcePropType,
  '역사 명소': HistoricalImage as unknown as ImageSourcePropType,
  액티비티: ActivityImage as unknown as ImageSourcePropType,
  숙소: LodgingImage as unknown as ImageSourcePropType,
  기타: EtcImage as unknown as ImageSourcePropType,
};

export const getPlaceImageSource = (
  imageUrl: string | null | undefined,
  categoryTag: CourseCategoryTag | null | undefined,
): ImageSourcePropType => {
  const trimmedImageUrl = imageUrl?.trim();
  return trimmedImageUrl
    ? { uri: trimmedImageUrl }
    : (categoryImages[categoryTag ?? '기타'] ?? categoryImages.기타);
};
