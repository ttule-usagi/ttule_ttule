import { QueryClient } from '@tanstack/react-query';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlaceSearchResults } from '../../api/placeSearch';

export async function prefetchPlaceSearch(queryClient: QueryClient, query: string) {
  const supabase = await supabaseUser();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['place-search', query],
    queryFn: ({ pageParam = 0 }) => getPlaceSearchResults({ supabase, query, offset: pageParam }),
    initialPageParam: 0,
  });
}
