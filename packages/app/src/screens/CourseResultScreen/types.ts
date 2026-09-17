import type { CourseCategoryTag } from '../../controllers';

export interface CoursePlaceInput {
  id: string;
  externalId: string | null;
  name: string;
  tag: string;
  categoryTag: CourseCategoryTag | null;
  summary: string;
  image: string | null;
  lat: number | null;
  lng: number | null;
}
