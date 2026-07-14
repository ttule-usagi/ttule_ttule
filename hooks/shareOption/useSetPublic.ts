import { setPublic } from '@/lib/actions/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { useModalStore } from '@/lib/store/modalStore';
import { ResourceParams, SetPublicParams } from '@/types/shareOption';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSetPublic = ({ id, resourceType }: ResourceParams) => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: (params: SetPublicParams) => setPublic(params),
    onSuccess: (result) => {
      if ('error' in result) {
        console.error('공개/비공개 설정 실패: ', result.error, result.code);
        open({
          type: 'error',
          props: {
            title: '공개/비공개 설정 실패',
            description: `${result.error}\n잠시 후 다시 시도해주세요.`,
          },
        });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: [RESOURCE_QUERY_KEY[resourceType], id, 'detail'],
      });
    },
  });
};
