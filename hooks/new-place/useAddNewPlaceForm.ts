import { useReducer } from 'react';

import type { CreatePlacePayload } from '@/types/corePlace';

export type PlaceCategory =
  | 'airport'
  | 'restaurant'
  | 'atm'
  | 'shopping'
  | 'cafe'
  | 'hotel'
  | 'convenience'
  | 'etc'
  | 'terminal'
  | 'culture'
  | 'leisure'
  | 'nature'
  | 'sports'
  | 'medical'
  | 'education'
  | 'traffic'
  | 'gas_station'
  | 'parking'
  | 'landmark';

export interface PlaceSearchResult {
  google_place_id: string;
  english_name: string;
  formatted_address: string;
  primary_type: string;
  latitude: number;
  longitude: number;
}

interface FormState {
  searchQuery: string;
  selectedPlace: PlaceSearchResult | null;
  korean_name: string;
  original_name: string;
  category: PlaceCategory;
  errors: Partial<Record<'korean_name', string>>;
}

type Action =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SELECT_PLACE'; payload: PlaceSearchResult; mappedCategory: PlaceCategory }
  | { type: 'SET_KOREAN_NAME'; payload: string }
  | { type: 'SET_ORIGINAL_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: PlaceCategory }
  | { type: 'SET_ERROR'; field: 'korean_name'; message: string }
  | { type: 'RESET' };

const initialState: FormState = {
  searchQuery: '',
  selectedPlace: null,
  korean_name: '',
  original_name: '',
  category: 'etc',
  errors: {},
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_PLACE':
      return {
        ...state,
        selectedPlace: action.payload,
        category: action.mappedCategory,
        korean_name: '',
        original_name: '',
        errors: {},
      };
    case 'SET_KOREAN_NAME':
      return { ...state, korean_name: action.payload, errors: { ...state.errors, korean_name: undefined } };
    case 'SET_ORIGINAL_NAME':
      return { ...state, original_name: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const TYPE_MAP: Record<string, PlaceCategory> = {
  airport: 'airport',
  train_station: 'terminal',
  subway_station: 'terminal',
  bus_station: 'terminal',
  transit_station: 'terminal',
  bus_stop: 'terminal',
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
  steak_house: 'restaurant',
  buffet_restaurant: 'restaurant',
  fine_dining_restaurant: 'restaurant',
  brunch_restaurant: 'restaurant',
  cafe: 'cafe',
  bakery: 'cafe',
  coffee_shop: 'cafe',
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
  convenience_store: 'convenience',
  supermarket: 'convenience',
  grocery_store: 'convenience',
  atm: 'atm',
  bank: 'atm',
  museum: 'culture',
  art_gallery: 'culture',
  church: 'culture',
  place_of_worship: 'culture',
  library: 'culture',
  historical_landmark: 'culture',
  monument: 'culture',
  cultural_landmark: 'culture',
  performing_arts_theater: 'culture',
  opera_house: 'culture',
  concert_hall: 'culture',
  amusement_park: 'leisure',
  zoo: 'leisure',
  aquarium: 'leisure',
  night_club: 'leisure',
  casino: 'leisure',
  bowling_alley: 'leisure',
  movie_theater: 'leisure',
  park: 'nature',
  beach: 'nature',
  campground: 'nature',
  national_park: 'nature',
  hiking_area: 'nature',
  lake: 'nature',
  mountain: 'nature',
  waterfall: 'nature',
  stadium: 'sports',
  gym: 'sports',
  sports_complex: 'sports',
  golf_course: 'sports',
  ski_resort: 'sports',
  hospital: 'medical',
  pharmacy: 'medical',
  doctor: 'medical',
  dentist: 'medical',
  clinic: 'medical',
  school: 'education',
  university: 'education',
  gas_station: 'gas_station',
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

export function useAddNewPlaceForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function validate(): boolean {
    if (!state.korean_name.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'korean_name', message: '한국어 이름을 입력해주세요.' });
      return false;
    }
    return true;
  }

  function buildPayload(): CreatePlacePayload | null {
    if (!state.selectedPlace) return null;
    return {
      google_place_id: state.selectedPlace.google_place_id,
      english_name: state.selectedPlace.english_name,
      korean_name: state.korean_name.trim(),
      original_name: state.original_name.trim() || null,
      address: state.selectedPlace.formatted_address,
      latitude: state.selectedPlace.latitude,
      longitude: state.selectedPlace.longitude,
      category: state.category,
      business_status: null,
      website_uri: null,
      phone_number: null,
      image_url: null,
    };
  }

  return { state, dispatch, validate, buildPayload, mapPrimaryTypeToCategory };
}
