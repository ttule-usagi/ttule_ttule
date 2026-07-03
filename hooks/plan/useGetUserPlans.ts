import { useQuery } from '@tanstack/react-query';

export interface PlanOverview {
  id: string;
  title: string;
  destination: string;
  departureDate: string | null;
  arrivalDate: string | null;
  isDateUndecided: boolean;
  totalDays: number;
}

const fetchUserPlans = async (): Promise<PlanOverview[]> => {
  const res = await fetch('/api/view/plan');
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('여행 계획 목록을 가져오는 데 실패했습니다.');
  return res.json();
};

export const useGetUserPlans = () => {
  return useQuery({
    queryKey: ['plan', 'list'],
    queryFn: fetchUserPlans,
    staleTime: 1000 * 60,
  });
};
