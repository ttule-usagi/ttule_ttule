import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { deletePlaceList } from '@/lib/actions/placeList';
import { useModalStore } from '@/lib/store/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePlaceList = () => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (listId: string) => {
      const result = await deletePlaceList(listId);

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['place-list'],
      });
    },
    onError: (error) => {
      console.error('❌ 참여 유저 삭제 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, '장소 리스트 삭제')
          : getErrorMessage('INTERNAL_ERROR', '장소 리스트 삭제');

      open({
        type: 'error',
        props: {
          title: '장소 리스트 삭제 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
