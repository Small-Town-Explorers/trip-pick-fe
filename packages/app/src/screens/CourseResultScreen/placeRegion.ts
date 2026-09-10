const ADMINISTRATIVE_SUFFIX_PATTERN = /(특별자치시|특별자치도|특별시|광역시|시|군|구|도)$/;

const PROVINCE_ALIASES: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원특별자치도: '강원',
  강원도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라북도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
};

const compact = (value: string) => value.replace(/\s+/g, '');

const includesAdministrativeName = (address: string, name: string) => {
  if (address.includes(name)) return true;

  const shortName = name.replace(ADMINISTRATIVE_SUFFIX_PATTERN, '');
  return shortName.length >= 2 && address.includes(shortName);
};

export type CourseRegionForComparison = {
  name: string;
  province: string;
};

export const isAddressInCourseRegion = (
  address: string,
  courseRegion: CourseRegionForComparison,
) => {
  const normalizedAddress = compact(address);
  const normalizedRegion = compact(courseRegion.name);
  const normalizedProvince = compact(courseRegion.province);

  // 주소가 없는 장소는 지역을 판별할 수 없으므로 경고 대상에서 제외한다.
  if (!normalizedAddress || !normalizedRegion) return true;

  const isSameRegion = includesAdministrativeName(normalizedAddress, normalizedRegion);
  const provinceAlias = PROVINCE_ALIASES[normalizedProvince];
  const isSameProvince =
    !normalizedProvince ||
    includesAdministrativeName(normalizedAddress, normalizedProvince) ||
    (provinceAlias ? normalizedAddress.includes(provinceAlias) : false);

  return isSameRegion && isSameProvince;
};
