import { QueryClient } from '@tanstack/react-query';
import { getPlaceListPlaces, getPlaceListPlacesCoordinate, getPlaceListTags } from '@/lib/actions/api/placeList';
import type { PageParam } from '@/types/placeList';
import { placeListPlacesQueryOptions } from '@/hooks/place-list/useGetPlaceListPlaces';
import { placeListTagsQueryOptions } from '@/hooks/place-list/useGetPlaceListTags';
import type { SupabaseClient } from '@supabase/supabase-js';
import { placeListPlacesCoordinateQueryOptions } from '@/hooks/place-list/useGetPlaceListPlacesCoordinate';

export async function prefetchPlaceListDetail(queryClient: QueryClient, listId: string, supabase: SupabaseClient) {
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      ...placeListPlacesQueryOptions({ listId, sortBy: 'created_desc' }),
      // queryFn만 서버 직접 호출로 오버라이드
      queryFn: ({ pageParam }) =>
        getPlaceListPlaces({ supabase, listId, sortBy: 'created_desc', cursor: pageParam as PageParam }),
      initialPageParam: null as PageParam,
    }),
    queryClient.prefetchQuery({
      ...placeListPlacesCoordinateQueryOptions(listId),
      queryFn: () => getPlaceListPlacesCoordinate({ supabase, listId }),
    }),
    // TODO: 2차에 태그 기능 추가
    // queryClient.prefetchQuery({
    //   ...placeListTagsQueryOptions(listId),
    //   queryFn: () => getPlaceListTags({ supabase, listId }),
    // }),
  ]);
}
