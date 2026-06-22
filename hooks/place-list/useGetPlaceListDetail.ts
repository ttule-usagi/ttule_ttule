import { getPlaceListDetail } from '@/lib/actions/placeList';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

// queryOptions 정의 - 서버/클라이언트 캐시 동기화를 위해
export const placeListDetailQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'detail'],
    queryFn: () => getPlaceListDetail(listId),
  });
};

export const useGetPlaceListDetail = (listId: string) => {
  return useSuspenseQuery(placeListDetailQueryOptions(listId));
};
