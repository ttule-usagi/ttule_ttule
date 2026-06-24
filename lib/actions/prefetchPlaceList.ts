import { QueryClient } from '@tanstack/react-query';
import { getAllPlaceLists } from './placeList';

export async function prefetchPlaceList(queryClient: QueryClient) {
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['place-list', 'owned'],
      queryFn: ({ pageParam = 0 }) => getAllPlaceLists({ listType: 'owned', offset: pageParam }),
      initialPageParam: 0,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['place-list', 'shared'],
      queryFn: ({ pageParam = 0 }) => getAllPlaceLists({ listType: 'shared', offset: pageParam }),
      initialPageParam: 0,
    }),
  ]);
}
