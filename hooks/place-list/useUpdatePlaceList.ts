import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlaceList } from '@/lib/actions/placeList';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { UpdatePlaceListParams } from '@/types/placeList';

export const useUpdatePlaceList = (listId: string) => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (params: UpdatePlaceListParams) => {
      const result = await updatePlaceList({ params });

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place-list', listId, 'places', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['place-list', listId, 'detail'] });
    },
    onError: (error) => {
      console.error('❌ 장소 리스트 편집 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '장소 리스트', action: '편집' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '장소 리스트', action: '편집' });

      open({
        type: 'error',
        props: {
          title: '장소 리스트 편집 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
