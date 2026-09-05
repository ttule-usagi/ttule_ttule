import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTags } from '@/lib/actions/placeList';
import { RpcError } from '@/types/errors';
import { Place, TagRowParams } from '@/types/placeList';

import { placeListTagsQueryOptions } from './useGetPlaceListTags';

export const useUpdateTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, tags }: { listId: string; tags: TagRowParams[] }) => {
      const result = await updateTags({ listId, tags });

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.setQueryData(placeListTagsQueryOptions(variables.listId).queryKey, result.data);

      // 태그 삭제 및 수정 시 단일 장소 컴포넌트에 즉시 반영하기 위해 Map 선언
      const tagMap = new Map(result.data.map((tag) => [tag.id, tag]));

      queryClient.setQueriesData(
        {
          queryKey: ['place-list', variables.listId, 'places', 'list'],
        },
        (old: InfiniteData<Place[]> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((place) => ({
                ...place,
                tags: place.tags.map((tag) => tagMap.get(tag.id)).filter((tag) => tag !== undefined),
              })),
            ),
          };
        },
      );
    },
    onError: (error) => {
      console.error('❌ 태그 편집 실패', error);
    },
  });
};
