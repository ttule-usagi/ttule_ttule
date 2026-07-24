import { deleteMember } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { DeleteMemberParams, ResourceParams } from '@/types/shareOption';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMember = ({ id, resourceType }: ResourceParams) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (params: DeleteMemberParams) => {
      const result = await deleteMember(params);

      // 에러 던지기 -> onError에서 잡음
      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['members', RESOURCE_QUERY_KEY[resourceType], id],
      });
    },
    onError: (error) => {
      console.error('참여 유저 삭제 실패: ', error.message);

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '참여 유저', action: '삭제' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '참여 유저', action: '삭제' });

      open({
        type: 'error',
        props: {
          title: '참여 유저 삭제 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
