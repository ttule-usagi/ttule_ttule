// 장소 카테고리
export const PLACE_CATEGORIES = [
  { value: 'restaurant', label: '음식점' },
  { value: 'cafe', label: '카페' },
  { value: 'hotel', label: '숙소' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'landmark', label: '명소' },
  { value: 'culture', label: '문화' },
  { value: 'convenience', label: '편의점' },
  { value: 'atm', label: 'ATM' },
  { value: 'education', label: '교육' },
  { value: 'airport', label: '공항' },
  { value: 'terminal', label: '터미널' },
  { value: 'traffic', label: '교통' },
  { value: 'leisure', label: '레저' },
  { value: 'nature', label: '자연' },
  { value: 'sports', label: '스포츠' },
  { value: 'medical', label: '의료' },
  { value: 'gas_station', label: '주유소' },
  { value: 'parking', label: '주차장' },
  { value: 'etc', label: '기타' },
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]['value'];
// → 'restaurant' | 'cafe' | 'hotel' | ... | 'etc'

export const TYPE_MAP: Record<string, PlaceCategory> = {
  airport: 'airport',
  train_station: 'traffic',
  subway_station: 'traffic',
  bus_station: 'traffic',
  transit_station: 'traffic',
  bus_stop: 'traffic',
  ferry_terminal: 'terminal',
  restaurant: 'restaurant',
  meal_takeaway: 'restaurant',
  meal_delivery: 'restaurant',
  fast_food_restaurant: 'restaurant',
  japanese_restaurant: 'restaurant',
  chinese_restaurant: 'restaurant',
  korean_restaurant: 'restaurant',
  american_restaurant: 'restaurant',
  italian_restaurant: 'restaurant',
  french_restaurant: 'restaurant',
  seafood_restaurant: 'restaurant',
  brunch_restaurant: 'restaurant',
  dutch_restaurant: 'restaurant',
  hamburgur_restaurant: 'restaurant',
  halal_restaurant: 'restaurant',
  mexican_restaurant: 'restaurant',
  asian_restaurant: 'restaurant',
  dim_sum_restaurant: 'restaurant',
  steak_house: 'restaurant',
  buffet_restaurant: 'restaurant',
  fine_dining_restaurant: 'restaurant',
  brewery: 'restaurant',
  deli: 'restaurant',
  wine_bar: 'restaurant',
  winery: 'restaurant',
  cafe: 'cafe',
  cafteria: 'cafe',
  dessert_shop: 'cafe',
  cake_shop: 'cafe',
  cat_cafe: 'cafe',
  dog_cafe: 'cafe',
  ice_cream_shop: 'cafe',
  dessert_restaurant: 'cafe',
  coffee_shop: 'cafe',
  tea_house: 'cafe',
  bakery: 'cafe',
  bagle_shop: 'cafe',
  lodging: 'hotel',
  hotel: 'hotel',
  motel: 'hotel',
  bed_and_breakfast: 'hotel',
  resort_hotel: 'hotel',
  shopping_mall: 'shopping',
  department_store: 'shopping',
  clothing_store: 'shopping',
  shoe_store: 'shopping',
  jewelry_store: 'shopping',
  book_store: 'shopping',
  electronics_store: 'shopping',
  furniture_store: 'shopping',
  home_goods_store: 'shopping',
  market: 'shopping',
  outlet_mall: 'shopping',
  food_store: 'shopping',
  gift_shop: 'shopping',
  tea_store: 'shopping',
  cosmetics_store: 'shopping',
  convenience_store: 'convenience',
  supermarket: 'shopping',
  grocery_store: 'shopping',
  atm: 'atm',
  bank: 'atm',
  museum: 'culture',
  art_museum: 'culture',
  art_gallery: 'culture',
  art_studio: 'culture',
  church: 'culture',
  place_of_worship: 'culture',
  historical_landmark: 'landmark',
  monument: 'culture',
  cultural_landmark: 'landmark',
  performing_arts_theater: 'culture',
  opera_house: 'culture',
  concert_hall: 'culture',
  history_museum: 'culture',
  mosque: 'culture',
  amusement_park: 'leisure',
  water_park: 'leisure',
  marina: 'leisure',
  zoo: 'leisure',
  aquarium: 'leisure',
  night_club: 'leisure',
  casino: 'leisure',
  bowling_alley: 'leisure',
  movie_theater: 'leisure',
  spa: 'leisure',
  park: 'nature',
  beach: 'nature',
  campground: 'nature',
  national_park: 'nature',
  hiking_area: 'nature',
  lake: 'nature',
  mountain: 'nature',
  garden: 'nature',
  waterfall: 'nature',
  river: 'nature',
  woods: 'nature',
  stadium: 'sports',
  gym: 'sports',
  sports_complex: 'sports',
  golf_course: 'sports',
  ski_resort: 'sports',
  swimming_pool: 'sports',
  hospital: 'medical',
  pharmacy: 'medical',
  doctor: 'medical',
  dentist: 'medical',
  clinic: 'medical',
  massage: 'medical',
  sauna: 'medical',
  school: 'education',
  university: 'education',
  library: 'education',
  gas_station: 'gas_station',
  rest_stop: 'traffic',
  electric_vehicle_charging_: 'traffic',
  parking: 'parking',
  parking_lot: 'parking',
  parking_garage: 'parking',
  tourist_attraction: 'landmark',
  point_of_interest: 'landmark',
  landmark: 'landmark',
};

export function mapPrimaryTypeToCategory(primaryType: string): PlaceCategory {
  return TYPE_MAP[primaryType] ?? 'etc';
}

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
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  category: string;
  savedCount: number;
  averageRating: number;
  reviewCount: number;
  isSaved: boolean;
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
  category: string;
  savedCount: number;
  averageRating: number | null;
  reviewCount: number | null;
  isSaved: boolean;
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
