export interface CorePlaceSearchResult {
  id: number;
  englishName: string;
  originalName?: string;
  koreanName: string;
  address?: string;
  category?: string; // place_category
  savedCount: number;
}

export interface CorePlaceDetail {
  id: number;
  googlePlaceId: string;
  latitude?: number;
  longitude?: number;
  koreanName: string;
  address?: string;
  category?: string; // place_category
  status?: string; // approval_status
  businessStatus?: string; // business_status
  savedCount: number;
  createdAt?: string;
  averageRating?: number;
  reviewCount?: number;
  englishName: string;
  originalName?: string;
  // uploaded_by
  // updated_at
  // deleted_at
}
