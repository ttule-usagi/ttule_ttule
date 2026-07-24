import { useQuery } from '@tanstack/react-query';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';

export interface PlanScheduleOverview {
  id: string;
  dayNumber: number;
  scheduleDate: string | null;
  title: string | null;
}

const fetchPlanSchedules = async (planId: string): Promise<PlanScheduleOverview[]> => {
  const res = await fetch(`/api/view/plan/${planId}/schedules`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }
  return res.json();
};

// enabled: !!planId 옵션이 필요하므로 useQuery사용
export const useGetPlanSchedules = (planId: string | null) => {
  return useQuery({
    queryKey: ['plan', planId, 'schedules'],
    queryFn: () => fetchPlanSchedules(planId!),
    enabled: !!planId,
    staleTime: 1000 * 60,
  });
};
