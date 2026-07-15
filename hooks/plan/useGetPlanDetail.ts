import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { PlanDetail } from '@/types/plan';

const fetchPlanDetail = async (planId: string): Promise<PlanDetail> => {
  const res = await fetch(`/api/view/plan/${planId}/detail`);
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('계획 정보를 가져오는 데 실패했습니다.');
  return res.json();
};

export const planDetailQueryOptions = (planId: string) =>
  queryOptions({
    queryKey: ['plan', planId, 'detail'],
    queryFn: () => fetchPlanDetail(planId),
  });

export const useGetPlanDetail = (planId: string) => {
  return useSuspenseQuery(planDetailQueryOptions(planId));
};
