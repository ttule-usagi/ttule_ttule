import { RpcError } from '@/types/errors';
import { Tag } from '@/types/placeList';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchPlaceListTags = async (listId: string): Promise<Tag[]> => {
  const res = await fetch(`/api/view/place-list/${listId}/tags`);
  if (res.status === 401) throw new RpcError('UNAUTHORIZED');
  if (!res.ok) throw new RpcError('장소 리스트에 저장된 태그를 가져오는 데 실패했습니다.');
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
