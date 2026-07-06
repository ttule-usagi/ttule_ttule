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
  placeId: string | null;
  placeName: string;
  placeCategory: string | null;
  placeThumbnail: string | null;
  googlePlaceId: string | null;
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
  members: PlanMember[];
  schedules: PlanSchedule[];
  items: PlanItem[];
}

export type PlanTransitMode =
  | 'walking'
  | 'cycling'
  | 'driving'
  | 'bus'
  | 'taxi'
  | 'train'
  | 'subway'
  | 'hsr' // 고속철도
  | 'tram'
  | 'ferry'
  | 'airplane';

export const TRANSIT_MODE_LABELS: Record<PlanTransitMode, string> = {
  walking: '도보',
  cycling: '자전거',
  driving: '자가용',
  bus: '버스',
  taxi: '택시',
  train: '기차',
  subway: '지하철',
  hsr: '고속철도',
  tram: '트램',
  ferry: '페리',
  airplane: '비행기',
};
