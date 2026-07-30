import { useQuery } from '@tanstack/react-query';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';

export interface PlanOverview {
  id: string;
  title: string;
  destination: string;
  departureDate: string | null;
  arrivalDate: string | null;
  isDateUndecided: boolean;
  totalDays: number;
  memberCount: number;
  updatedAt: string;
}

const fetchUserPlans = async (): Promise<PlanOverview[]> => {
  const res = await fetch('/api/view/plan');

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }
  return res.json();
};

export const useGetUserPlans = () => {
  return useQuery({
    queryKey: ['plan', 'list'],
    queryFn: fetchUserPlans,
    staleTime: 1000 * 60,
  });
};
