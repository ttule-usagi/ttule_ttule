import { queryOptions, useQuery } from '@tanstack/react-query';

import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { PlanOverview } from '@/types/plan';

const fetchUserPlans = async (): Promise<PlanOverview[]> => {
  const res = await fetch('/api/view/plan');

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }
  return res.json();
};

export const planListQueryOptions = () => {
  return queryOptions({
    queryKey: ['plan', 'list'],
    queryFn: fetchUserPlans,
    staleTime: 1000 * 60,
  });
};

// 모달 진입용
export const useGetUserPlans = () => {
  return useQuery(planListQueryOptions());
};
