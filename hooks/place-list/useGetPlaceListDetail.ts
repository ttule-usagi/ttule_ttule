import { getPlaceListDetail, getPlaceListPlaces } from '@/lib/actions/placeList';
import { PageParam } from '@/types/placeList';
import { infiniteQueryOptions, queryOptions, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

// queryOptions 정의 - 서버/클라이언트 캐시 동기화를 위해
// 리스트 개요 queryOptions
export const placeListDetailQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'detail'],
    queryFn: () => getPlaceListDetail(listId),
  });
};

// 리스트에 저장된 장소 queryOptions
export const placeListPlacesQueryOptions = (listId: string) => {
  return infiniteQueryOptions({
    queryKey: ['place-list', listId, 'places'],
    queryFn: ({ pageParam }) => getPlaceListPlaces(listId, pageParam),
    initialPageParam: null as PageParam,
    getNextPageParam: (lastPage) =>
      lastPage.length < 20 ? undefined : { createdAt: lastPage.at(-1)!.createdAt, id: lastPage.at(-1)!.id },
  });
};

export const useGetPlaceListDetail = (listId: string) => {
  return useSuspenseQuery(placeListDetailQueryOptions(listId));
};

export const useGetPlaceListPlaces = (listId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery(placeListPlacesQueryOptions(listId));
  return { data: data.pages.flat(), ...rest };
};
