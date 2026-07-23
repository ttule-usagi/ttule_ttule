import { QueryClient } from '@tanstack/react-query';
import { getPlaceListPlaces, getPlaceListTags } from '@/lib/actions/api/placeList';
import type { PageParam } from '@/types/placeList';
import { placeListPlacesQueryOptions } from '@/hooks/place-list/useGetPlaceListPlaces';
import { placeListTagsQueryOptions } from '@/hooks/place-list/useGetPlaceListTags';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function prefetchPlaceListDetail(queryClient: QueryClient, listId: string, supabase: SupabaseClient) {
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      ...placeListPlacesQueryOptions(listId),
      // queryFn만 서버 직접 호출로 오버라이드
      queryFn: ({ pageParam }) => getPlaceListPlaces({ supabase, listId, cursor: pageParam as PageParam }),
      initialPageParam: null as PageParam,
    }),
    queryClient.prefetchQuery({
      ...placeListTagsQueryOptions(listId),
      queryFn: () => getPlaceListTags({ supabase, listId }),
    }),
  ]);
}
