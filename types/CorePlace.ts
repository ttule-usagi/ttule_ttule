// 장소 카테고리
export const PLACE_CATEGORIES = [
  { value: 'restaurant', label: '음식점' },
  { value: 'cafe', label: '카페' },
  { value: 'hotel', label: '호텔' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'culture', label: '문화' },
  { value: 'leisure', label: '레저' },
  { value: 'nature', label: '자연' },
  { value: 'sports', label: '스포츠' },
  { value: 'medical', label: '의료' },
  { value: 'education', label: '교육' },
  { value: 'airport', label: '공항' },
  { value: 'terminal', label: '터미널' },
  { value: 'traffic', label: '교통' },
  { value: 'gas_station', label: '주유소' },
  { value: 'parking', label: '주차장' },
  { value: 'convenience', label: '편의점' },
  { value: 'atm', label: 'ATM' },
  { value: 'etc', label: '기타' },
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]['value'];
// → 'restaurant' | 'cafe' | 'hotel' | ... | 'etc'

export interface CreatePlacePayload {
  google_place_id: string;
  latitude: number;
  longitude: number;
  address: string;
  business_status?: string | null;
  korean_name: string | null;
  english_name: string | null;
  original_name: string | null;
  website_uri: string | null;
  phone_number: string | null;
  category: PlaceCategory;
  image_url: string | null;
}

export const BUSINESS_STATUS = ['OPERATIONAL', 'CLOSED_TEMPORARILY', 'CLOSED_PERMANENTLY'] as const;
export type BusinessStatus = (typeof BUSINESS_STATUS)[number];

export const sanitizeBusinessStatus = (raw?: string): BusinessStatus | null => {
  if (!raw) return null;
  return BUSINESS_STATUS.includes(raw as BusinessStatus) ? (raw as BusinessStatus) : null;
};

export interface AutoCompleteResult {
  id: string;
  name: string;
}

// 자동완성 리스트 조회
export interface AutoCompleteResults {
  items: AutoCompleteResult[];
}

export interface PlaceSearchResult {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  category: string;
  savedCount: number;
  averageRating: number;
  reviewCount: number;
}

export interface PlaceSearchResults {
  items: PlaceSearchResult[];
  totalCount: number;
}

export interface CorePlaceSearchResult {
  id: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string | null;
  category: string | null;
  savedCount: number;
  averageRating: number | null;
  reviewCount: number | null;
}


export interface CorePlace {
  id: string;
  koreanName: string;
  englishName: string | null;
  originalName: string | null;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  businessStatus: string;
  averageRating: number;
  reviewCount: number;
  savedCount: number;
  websiteUri: string | null;
  phoneNumber: string | null;
  googlePlaceId: string;
}

export interface CorePlaceImage {
  id: string;
  imgUrl: string;
  isMain: boolean;
  sortOrder: number;
}

export interface CorePlaceReview {
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface CorePlaceSavedList {
  id: string;
  title: string;
  icon: string;
}

export interface CorePlaceDetail {
  place: CorePlace;
  images: CorePlaceImage[];
  reviews: CorePlaceReview[];
  savedLists: CorePlaceSavedList[];
}