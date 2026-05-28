'use client';

import { useState, useReducer } from 'react';
import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import { useCreatePlace } from './new-place/useCreatePlace';
import { sanitizeBusinessStatus, type PlaceCategory } from '@/types/CorePlace';

export interface NewPlaceFormState {
  korean_name: string;
  english_name: string;
  original_name: string;
  category: PlaceCategory | '';
  website_uri: string;
  phone_number: string;
  imageUrl: string | null;
}

interface UseNewPlaceFormOptions {
  onSuccess?: (placeId: string) => void;
}

export type Action =
  | {
      type: 'SET_FIELD';
      field: 'korean_name' | 'english_name' | 'original_name' | 'website_uri' | 'phone_number';
      value: string;
    }
  | { type: 'SET_CATEGORY'; value: PlaceCategory }
  | { type: 'SET_IMAGES'; url: string | null };

// reducer
const reducer = (state: NewPlaceFormState, action: Action): NewPlaceFormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_CATEGORY':
      return { ...state, category: action.value };
    case 'SET_IMAGES':
      return { ...state, imageUrl: action.url };
  }
};

// 초기값 세팅
const getInitialState = (place: SelectedGooglePlace): NewPlaceFormState => {
  const primaryText = place.displayName.text;
  const primaryLang = place.displayName.languageCode;
  const englishText = place.additionalData?.displayName?.text ?? '';

  const isKoreanText = primaryLang === 'ko';
  const isEnglishText = primaryLang === 'en';

  return {
    korean_name: isKoreanText ? primaryText : '',
    english_name: englishText,
    original_name: !isKoreanText && !isEnglishText ? primaryText : '',
    category: '',
    website_uri: '',
    phone_number: '',
    imageUrl: null,
  };
};

export const checkIsKorean = (lat: number, lng: number) => lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132;

// 검증
const validate = (state: NewPlaceFormState, isKorean: boolean): string | null => {
  if (isKorean && !state.korean_name.trim()) {
    return '한국어 이름을 입력해주세요.';
  }
  if (!isKorean && !state.english_name.trim()) {
    return '영문 이름을 입력해주세요.';
  }
  if (!state.category) {
    return '카테고리를 선택해주세요.';
  }
  return null;
};

export function useNewPlaceForm(place: SelectedGooglePlace, options?: UseNewPlaceFormOptions) {
  const isKorean = checkIsKorean(place.location.latitude, place.location.longitude);
  const [state, dispatch] = useReducer(reducer, getInitialState(place));
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate, isPending, error: mutationError } = useCreatePlace();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const error = validate(state, isKorean);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    mutate(
      {
        google_place_id: place.id,
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        address: place.formattedAddress ?? '',
        business_status: sanitizeBusinessStatus(place.additionalData?.businessStatus),
        korean_name: state.korean_name || null,
        english_name: state.english_name || null,
        original_name: state.original_name || null,
        website_uri: state.website_uri || null,
        phone_number: state.phone_number || null,
        category: state.category as PlaceCategory,
        image_url: state.imageUrl,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            options?.onSuccess?.(result.placeId);
          }
        },
      },
    );
  };

  return {
    state,
    dispatch,
    isKorean,
    handleSubmit,
    isPending,
    error: validationError ?? mutationError?.message ?? null,
  };
}
