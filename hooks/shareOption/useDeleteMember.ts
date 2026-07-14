import { deleteMember } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { DeleteMemberParams, ResourceParams } from '@/types/shareOption';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMember = ({ id, resourceType }: ResourceParams) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: (params: DeleteMemberParams) => deleteMember(params),
    onSuccess: (result) => {
      if ('error' in result) {
        console.error('참여 유저 추방 실패: ', result.error, result.code);
        open({
          type: 'error',
          props: {
            title: '참여 유저 추방 실패',
            description: `${result.error}\n잠시 후 다시 시도해주세요.`,
          },
        });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['members', RESOURCE_QUERY_KEY[resourceType], id],
      });
    },
  });
};
