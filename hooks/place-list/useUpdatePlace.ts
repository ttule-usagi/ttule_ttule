import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { placeListTagsQueryOptions } from '@/hooks/place-list/useGetPlaceListTags';
import { updatePlace } from '@/lib/actions/placeList';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { Place } from '@/types/placeList';

export const useUpdatePlace = (listId: string) => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async ({ placeId, memo, tags }: { placeId: string; memo: string | null; tags: string[] }) => {
      const result = await updatePlace({ listId, placeId, memo, tags });

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: (_, variables) => {
      // 화면에 태그를 완전히 그리기 위해 리스트 태그 캐시에서 id로 역참조
      const listTags = queryClient.getQueryData(placeListTagsQueryOptions(listId).queryKey) ?? [];
      const tagMap = new Map(listTags.map((tag) => [tag.id, tag]));

      // 삭제된 태그가 섞여 있을 경우를 대비해 undefined 필터링
      const resolvedTags = variables.tags.map((id) => tagMap.get(id)).filter((tag) => tag !== undefined);

      queryClient.setQueriesData(
        { queryKey: ['place-list', listId, 'places', 'list'] },
        (old: InfiniteData<Place[]> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((p) =>
                p.id === variables.placeId ? { ...p, memoContent: variables.memo, tags: resolvedTags } : p,
              ),
            ),
          };
        },
      );
    },
    onError: (error) => {
      console.error('❌ 단일 장소 편집 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '단일 장소', action: '편집' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '단일 장소', action: '편집' });

      open({
        type: 'error',
        props: {
          title: '단일 장소 편집 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
