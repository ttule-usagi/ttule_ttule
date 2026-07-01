import { getPlaceListDetail, getPlaceListPlaces, getPlaceListTags } from '@/lib/actions/placeList';
import { PageParam, Place } from '@/types/placeList';
import { infiniteQueryOptions, queryOptions, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

// queryOptions 정의 - 서버/클라이언트 캐시 동기화를 위해
// 리스트 개요 queryOptions
export const placeListDetailQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'detail'],
    queryFn: () => getPlaceListDetail(listId),
  });
};

const fetchPlaceListPlaces = async (listId: string, cursor: PageParam): Promise<Place[]> => {
  const params = new URLSearchParams();
  if (cursor) {
    params.set('createdAt', cursor.createdAt);
    params.set('id', cursor.id);
  }
  const res = await fetch(`/api/view/place-list/${listId}/places?${params.toString()}`);
  if (!res.ok) throw new Error('저장된 장소를 가져오는 데 실패했습니다.');
  return res.json();
};

// 리스트에 저장된 장소 queryOptions
export const placeListPlacesQueryOptions = (listId: string) => {
  return infiniteQueryOptions({
    queryKey: ['place-list', listId, 'places'],
    queryFn: ({ pageParam }) => fetchPlaceListPlaces(listId, pageParam),
    initialPageParam: null as PageParam,
    getNextPageParam: (lastPage) =>
      lastPage.length < 20 ? undefined : { createdAt: lastPage.at(-1)!.createdAt, id: lastPage.at(-1)!.id },
  });
};

// 리스트에 저장된 태그
export const placeListTagsQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'tags'],
    queryFn: () => getPlaceListTags(listId),
  });
};

export const useGetPlaceListDetail = (listId: string) => {
  return useSuspenseQuery(placeListDetailQueryOptions(listId));
};

export const useGetPlaceListPlaces = (listId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery(placeListPlacesQueryOptions(listId));
  return { data: data.pages.flat(), ...rest };
};

export const useGetPlaceListTags = (listId: string) => {
  return useSuspenseQuery(placeListTagsQueryOptions(listId));
};
