// 장소 리스트
export interface PlaceList {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  viewToken: number;
  viewExpiresAt: Date;
  editToken: number;
  editExpiresAt: Date;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

// 장소 리스트 멤버
export interface PlaceListMember {
  id: number;
  placeListId: number;
  userId: number;
  role: string; // access_role
  createdAt: Date;
  updatedAt: Date;
}

// 단일 장소 아이템
export interface Place {
  id: number;
  placeListId: number;
  corePlaceId: number;
  latitude: number | null;
  longitude: number | null;
  customName: string;
  category: string | null; // place_category
  thumbnail: string | null;
  memoContent: string | null;
  createdAt: Date;
  updatedAt: Date;
}
