import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { PlanDetail } from '@/types/plan';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';

const fetchPlanDetail = async (planId: string): Promise<PlanDetail> => {
  const res = await fetch(`/api/view/plan/${planId}/detail`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }
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
