import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { PlanItem } from '@/types/plan';

const fetchScheduleItems = async (planId: string, scheduleId: string): Promise<PlanItem[]> => {
  const res = await fetch(`/api/view/plan/${planId}/items?scheduleId=${scheduleId}`);
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('일정 항목을 가져오는 데 실패했습니다.');
  return res.json();
};

export const scheduleItemsQueryOptions = (planId: string, scheduleId: string) =>
  queryOptions({
    queryKey: ['plan', planId, 'items', scheduleId],
    queryFn: () => fetchScheduleItems(planId, scheduleId),
  });

export const useGetScheduleItems = (planId: string, scheduleId: string, initialData?: PlanItem[]) => {
  return useSuspenseQuery({
    ...scheduleItemsQueryOptions(planId, scheduleId),
    initialData,
  });
};
