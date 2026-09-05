import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTags } from '@/lib/actions/placeList';
import { RpcError } from '@/types/errors';
import { TagRowParams } from '@/types/placeList';

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
    },
    onError: (error) => {
      console.error('❌ 태그 편집 실패', error);
    },
  });
};
