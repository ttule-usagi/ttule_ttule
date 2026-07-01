import { QueryClient } from '@tanstack/react-query';
import { getAllPlaceLists } from '@/lib/api/placeList';
import { supabaseUser }from '@/lib/utils/supabase';

export async function prefetchPlaceList(queryClient: QueryClient) {
  const supabase = await supabaseUser();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['place-list', 'owned'],
      queryFn: ({ pageParam = 0 }) => getAllPlaceLists({ supabase, listType: 'owned', offset: pageParam }),
      initialPageParam: 0,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['place-list', 'shared'],
      queryFn: ({ pageParam = 0 }) => getAllPlaceLists({ supabase, listType: 'shared', offset: pageParam }),
      initialPageParam: 0,
    }),
  ]);
}


