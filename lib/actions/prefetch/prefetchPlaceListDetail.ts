    
import { QueryClient } from '@tanstack/react-query';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlaceListPlaces } from '@/lib/api/placeList';
import type { PageParam } from '@/types/placeList';
import { placeListDetailQueryOptions, placeListTagsQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';

export async function prefetchPlaceListDetail(queryClient: QueryClient, listId: string) {
  const supabase = await supabaseUser();

  await Promise.all([
    queryClient.prefetchQuery(placeListDetailQueryOptions(listId)),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['place-list', listId, 'places'],
      // queryFn만 서버 직접 호출로 오버라이드
      queryFn: ({ pageParam }) =>
        getPlaceListPlaces({ supabase, listId, cursor: pageParam as PageParam }),
      initialPageParam: null as PageParam,
    }),
    queryClient.prefetchQuery(placeListTagsQueryOptions(listId)),
  ]);
}