// 장소 태그
export interface Tag {
  id: number;
  name: string;
  color: 'RED' | 'HOTPINK' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE' | 'GRAY';
}

// 장소 리스트
export interface PlaceListOverview {
  id: number;
  title: string;
  isPublic: boolean;
  placeCount: number;
  icon: string;
}

export interface PlaceListDetail extends PlaceListOverview {
  description: string;
  tags: Tag[];
  viewToken: number;
  viewExpiresAt: Date;
  editToken: number;
  editExpiresAt: Date;
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
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
