export const getNaverLink = (koreanName: string) => {
  return `https://map.naver.com/v5/search/${encodeURIComponent(koreanName)}`;
};

export const getGoogleLink = (googlePlaceId: string) => {
  return `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`;
};
