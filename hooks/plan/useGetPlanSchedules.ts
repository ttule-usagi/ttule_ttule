import { useQuery } from '@tanstack/react-query';

export interface PlanScheduleOverview {
  id: string;
  dayNumber: number;
  scheduleDate: string | null;
  title: string | null;
}

const fetchPlanSchedules = async (planId: string): Promise<PlanScheduleOverview[]> => {
  const res = await fetch(`/api/view/plan/${planId}/schedules`);
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 403) throw new Error('FORBIDDEN');
  if (!res.ok) throw new Error('일정을 가져오는 데 실패했습니다.');
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
