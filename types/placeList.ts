import { PlaceCategory } from './CorePlace';

//장소 리스트 유형 - 공유된, 저장된 리스트로 구분해서 볼 때 사용
export type ListType = 'all' | 'owned' | 'shared';
export type TagColor = 'red' | 'hotpink' | 'yellow' | 'green' | 'blue' | 'purple' | 'grey';

// 커서 기반 무한스크롤
export type PageParam = {
  id: string;
  createdAt: string;
} | null;

// 장소 태그
export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

// 장소 리스트
export interface PlaceListOverview {
  id: string;
  title: string;
  editToken: string;
  editTokenExpiresAt: string;
  viewToken: string;
  viewTokenExpiresAt: string;
  isPublic: boolean;
  placeCount: number;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

// 장소 리스트 목록 조회
export interface AllPlaceLists {
  items: PlaceListOverview[];
  totalCount: number;
}

// 장소 리스트 상세페이지
export interface PlaceListDetail extends PlaceListOverview {
  description: string;
  master: PlaceListMember;
  participants: PlaceListMember[];
  participantCount: number;
  tags?: Tag[]; // 태그 구현 시 분리
}

// 장소 리스트 멤버
export interface PlaceListMember {
  id: number;
  username?: string | null;
  profileImage?: string | null;
}

// 단일 장소 아이템
export interface Place {
  id: string;
  placeListId: number;
  corePlaceId: number;
  latitude: number | null;
  longitude: number | null;
  customName: string;
  category: PlaceCategory | null; // place_category
  thumbnail: string | null;
  memoContent: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}
