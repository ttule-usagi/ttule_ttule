import { QueryClient } from '@tanstack/react-query';

import { planListQueryOptions } from '@/hooks/plan/useGetUserPlans';
import { supabaseUser } from '@/lib/utils/supabase';

import { getAllPlanListOverview } from '../plan';

export async function prefetchLobbyPlanList(queryClient: QueryClient) {
  const supabase = await supabaseUser();

  await queryClient.prefetchQuery({
    ...planListQueryOptions(),
    queryFn: () => getAllPlanListOverview({ supabase }),
  });
}
