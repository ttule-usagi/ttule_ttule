import { GetPlacesParams, PageParam, Place, SortType } from '@/types/placeList';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';

const fetchPlaceListPlaces = async (listId: string, cursor: PageParam, sortBy: SortType): Promise<Place[]> => {
  const params = new URLSearchParams();
  params.set('sortBy', sortBy);
  if (cursor) {
    params.set('createdAt', cursor.createdAt);
    params.set('id', cursor.id);
  }
  const res = await fetch(`/api/view/place-list/${listId}/places?${params.toString()}`);
  if (!res.ok) throw new Error('저장된 장소를 가져오는 데 실패했습니다.');
  return res.json();
};

// 리스트에 저장된 장소 queryOptions
export const placeListPlacesQueryOptions = ({ listId, sortBy }: GetPlacesParams) => {
  return infiniteQueryOptions({
    queryKey: ['place-list', listId, 'places', 'list', sortBy],
    queryFn: ({ pageParam }) => fetchPlaceListPlaces(listId, pageParam, sortBy),
    initialPageParam: null as PageParam,
    getNextPageParam: (lastPage) =>
      lastPage.length < 20 ? undefined : { createdAt: lastPage.at(-1)!.createdAt, id: lastPage.at(-1)!.id },
  });
};

export const useGetPlaceListPlaces = ({ listId, sortBy }: GetPlacesParams) => {
  const { data, ...rest } = useSuspenseInfiniteQuery(placeListPlacesQueryOptions({ listId, sortBy }));
  return { data: data.pages.flat(), ...rest };
};
