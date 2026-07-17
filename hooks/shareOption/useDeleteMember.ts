import { deleteMember } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { RpcError } from '@/types/errors';
import { DeleteMemberParams, ResourceParams } from '@/types/shareOption';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMember = ({ id, resourceType }: ResourceParams) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (params: DeleteMemberParams) => {
      const result = await deleteMember(params);

      // 에러 던지기 -> onError에서 잡음
      if ('error' in result) {
        throw new RpcError(result.error, result.code);
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
      open({
        type: 'error',
        props: {
          title: '참여 유저 추방 실패',
          description: `${error.message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
