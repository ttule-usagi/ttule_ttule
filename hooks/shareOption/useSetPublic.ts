import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setPublic } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { ResourceType } from '@/types/invite';
import { SetPublicParams } from '@/types/shareOption';

export const useSetPublic = (resourceType: ResourceType) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (params: SetPublicParams) => {
      const result = await setPublic(params);

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RESOURCE_QUERY_KEY[resourceType]],
      });
    },
    onError: (error) => {
      console.error('공개 여부 설정 실패: ', error.message);

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '공개 여부', action: '설정' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '공개 여부', action: '설정' });

      open({
        type: 'error',
        props: {
          title: '공개 여부 설정 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
