import { deletePlace } from '@/lib/actions/placeList';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePlace = (listId: string) => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (placeId: string) => {
      const result = await deletePlace({ listId, placeId });

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['place-list', listId, 'places'],
      });
    },
    onError: (error) => {
      console.error('❌ 단일 장소 삭제 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '단일 장소', action: '삭제' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '단일 장소', action: '삭제' });

      open({
        type: 'error',
        props: {
          title: '단일 장소 삭제 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
