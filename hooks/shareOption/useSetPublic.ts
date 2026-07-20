import { setPublic } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { RpcError } from '@/types/errors';
import { ResourceParams, SetPublicParams } from '@/types/shareOption';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSetPublic = ({ id, resourceType }: ResourceParams) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (params: SetPublicParams) => {
      const result = await setPublic(params);

      if ('error' in result) {
        throw new RpcError(result.error, result.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RESOURCE_QUERY_KEY[resourceType], id, 'detail'],
      });
    },
    onError: (error) => {
      console.error('공개 여부 설정 실패: ', error.message);
      open({
        type: 'error',
        props: {
          title: '공개 여부 설정 실패',
          description: `${error.message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
