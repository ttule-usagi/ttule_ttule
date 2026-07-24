import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { Tag } from '@/types/placeList';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchPlaceListTags = async (listId: string): Promise<Tag[]> => {
  const res = await fetch(`/api/view/place-list/${listId}/tags`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }

  return res.json();
};

// 리스트에 저장된 태그
export const placeListTagsQueryOptions = (listId: string) => {
  return queryOptions({
    queryKey: ['place-list', listId, 'tags'],
    queryFn: () => fetchPlaceListTags(listId),
  });
};

export const useGetPlaceListTags = (listId: string) => {
  return useSuspenseQuery(placeListTagsQueryOptions(listId));
};
