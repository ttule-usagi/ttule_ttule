import { useSuspenseQuery } from '@tanstack/react-query';
import { placeListDetailQueryOptions } from '../place-list/useGetPlaceListDetail';
import { planDetailQueryOptions } from '../plan/useGetPlanDetail';
import { PlaceListDetail } from '@/types/placeList';
import { PlanDetail } from '@/types/plan';

// 장소 리스트 isPublic 가져오기
export const useGetPlaceListIsPublic = (id: string) => {
  return useSuspenseQuery({
    ...placeListDetailQueryOptions(id),
    select: (data: PlaceListDetail) => data.isPublic,
  });
};

// 계획 isPublic 가져오기
export const useGetPlanIsPublic = (id: string) => {
  return useSuspenseQuery({
    ...planDetailQueryOptions(id),
    select: (data: PlanDetail) => data.plan.isPublic,
  });
};
