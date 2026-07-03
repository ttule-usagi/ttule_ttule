// lib/actions/prefetch/prefetchCorePlace.ts
import { QueryClient } from '@tanstack/react-query';
import { supabaseUser } from '@/lib/utils/supabase';
import { getCorePlaceDetail } from '@/lib/api/corePlace';
import { corePlaceDetailQueryOptions } from '@/hooks/place/useGetCorePlace';

export async function prefetchCorePlace(queryClient: QueryClient, placeId: string) {
  const supabase = await supabaseUser();

  await queryClient.prefetchQuery({
    ...corePlaceDetailQueryOptions(placeId),
    queryFn: () => getCorePlaceDetail({ supabase, placeId }),
  });
}