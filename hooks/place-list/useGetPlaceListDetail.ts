import { RpcError } from '@/types/errors';
import { PlaceListDetail } from '@/types/placeList';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchPlaceListDetail = async (listId: string): Promise<PlaceListDetail> => {
  const res = await fetch(`/api/view/place-list/${listId}/detail`);
  if (res.status === 401) throw new RpcError('UNAUTHORIZED');
  if (!res.ok) throw new RpcError('장소 리스트 정보를 가져오는 데 실패했습니다.');
  return res.json();
};

// queryOptions 정의 - 서버/클라이언트 캐시 동기화를 위해
// 리스트 개요 queryOptions
export const placeListDetailQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'detail'],
    queryFn: () => fetchPlaceListDetail(listId),
  });
};

export const useGetPlaceListDetail = (listId: string) => {
  return useSuspenseQuery(placeListDetailQueryOptions(listId));
};
