import { useSuspenseQuery } from '@tanstack/react-query';
import { planDetailQueryOptions } from './useGetPlanDetail';
import type { PlanDetail } from '@/types/plan';

export const useGetPlanMyRole = (planId: string) => {
  return useSuspenseQuery({
    ...planDetailQueryOptions(planId),
    select: (data: PlanDetail) => data.myRole,
  });
};
