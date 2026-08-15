import { Role } from '@/types/shareOption';

export interface PlanInfo {
  id: string;
  title: string;
  destination: string;
  departureDate: string | null;
  arrivalDate: string | null;
  isDateUndecided: boolean;
  isPublic: boolean;
  totalDays: number;
  updatedAt: string;
}

export interface PlanMember {
  userId: string;
  username: string;
  profileImageUrl: string | null;
  role: string;
}

export interface PlanSchedule {
  id: string;
  dayNumber: number;
  scheduleDate: string | null;
  title: string | null;
}

export interface PlanItem {
  id: string;
  type: string;
  scheduleId: string;
  placeId: string;
  placeName: string;
  placeCategory: string | null;
  placeThumbnail: string | null;
  googlePlaceId: string;
  latitude: number | null;
  longitude: number | null;
  order: number;
  visitTime: string | null;
  memoContent: string | null;
  transitTime: number | null;
  transitDistance: number | null;
  transitMode: PlanTransitMode | null;
  transitMemo: string | null;
}

export interface PlanDetail {
  plan: PlanInfo;
  myRole: Role | null;
  members: PlanMember[];
  schedules: PlanSchedule[];
  items: PlanItem[];
}

export type PlanTransitMode = 'walking' | 'cycling' | 'driving' | 'transit';

export const TRANSIT_MODE_LABELS: Record<PlanTransitMode, string> = {
  transit: '대중교통',
  walking: '도보',
  cycling: '자전거',
  driving: '자동차',
};

export const VEHICLE_TO_TRAVEL_MODE: Record<PlanTransitMode, string> = {
  walking: 'WALK',
  cycling: 'BICYCLE',
  driving: 'DRIVE',
  transit: 'TRANSIT',
};

export interface PlanOverview {
  id: string;
  title: string;
  destination: string;
  departureDate: string | null;
  arrivalDate: string | null;
  isDateUndecided: boolean;
  totalDays: number;
  updatedAt: string;
  myRole: Role | null;
  isPublic: boolean;
}
