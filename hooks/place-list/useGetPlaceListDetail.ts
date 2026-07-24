import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { PlaceListDetail } from '@/types/placeList';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchPlaceListDetail = async (listId: string): Promise<PlaceListDetail> => {
  const res = await fetch(`/api/view/place-list/${listId}/detail`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }

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
