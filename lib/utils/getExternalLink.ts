import { CorePlace } from '@/types/corePlace';

export const getNaverLink = (koreanName: string) => {
  return `https://map.naver.com/v5/search/${encodeURIComponent(koreanName)}`;
};

// 범용 Maps urls 형식
export const getGoogleLink = (
  place: Pick<CorePlace, 'googlePlaceId' | 'koreanName' | 'englishName' | 'originalName'>,
) => {
  const name = place.koreanName || place.englishName || place.originalName || '';
  const params = new URLSearchParams({
    api: '1',
    query: name,
    query_place_id: place.googlePlaceId,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
};
