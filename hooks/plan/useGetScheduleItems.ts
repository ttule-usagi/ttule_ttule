import { queryOptions, useQuery } from '@tanstack/react-query';
import type { PlanItem } from '@/types/plan';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';

const fetchScheduleItems = async (planId: string, scheduleId: string): Promise<PlanItem[]> => {
  const res = await fetch(`/api/view/plan/${planId}/items?scheduleId=${scheduleId}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }
  return res.json();
};

export const scheduleItemsQueryOptions = (planId: string, scheduleId: string) =>
  queryOptions({
    queryKey: ['plan', planId, 'items', scheduleId],
    queryFn: () => fetchScheduleItems(planId, scheduleId),
  });

export const useGetScheduleItems = (planId: string, scheduleId: string, initialData?: PlanItem[]) => {
  return useQuery({
    ...scheduleItemsQueryOptions(planId, scheduleId),
    initialData,
  });
};
