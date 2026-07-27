import { PlaceCoordinates } from './../../types/placeList';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchPlaceListPlacesCoordinate = async (listId: string): Promise<PlaceCoordinates[]> => {
  const res = await fetch(`/api/view/place-list/${listId}/coordinate`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }

  return res.json();
};

// 리스트에 저장된 장소들의 지도 마커용 데이터
export const placeListPlacesCoordinateQueryOptions = (listId?: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'places', 'coordinate'],
    queryFn: () => fetchPlaceListPlacesCoordinate(listId ?? ''),
    enabled: !!listId,
  });
};

export const useGetPlaceListPlacesCoordinate = (listId: string) => {
  return useSuspenseQuery(placeListPlacesCoordinateQueryOptions(listId));
};
