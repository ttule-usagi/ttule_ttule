import { QueryClient } from '@tanstack/react-query';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlanDetail } from '@/lib/actions/api/plan';
import { planDetailQueryOptions } from '@/hooks/plan/useGetPlanDetail';

export async function prefetchPlanDetail(queryClient: QueryClient, planId: string) {
  const supabase = await supabaseUser();

  await queryClient.prefetchQuery({
    ...planDetailQueryOptions(planId),
    queryFn: () => getPlanDetail({ supabase, planId }),
  });
}
