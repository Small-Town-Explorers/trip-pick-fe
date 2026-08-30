export interface CoursePlaceInput {
  id: string;
  externalId: string | null;
  name: string;
  tag: string;
  summary: string;
  image: string | null;
  lat: number | null;
  lng: number | null;
}
