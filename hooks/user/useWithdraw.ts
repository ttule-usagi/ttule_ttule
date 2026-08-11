import { useMutation, useQueryClient } from '@tanstack/react-query';

import { withdraw } from '@/lib/actions/auth';
import { useModalStore } from '@/lib/store/modalStore';
import { RpcError } from '@/types/errors';

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async () => {
      const result = await withdraw();

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: () => {
      // TODO: 상세한 탈퇴 메세지는 추후 논의(DB 구조 변경 필요)
      open({
        type: 'error',
        props: {
          title: '서비스 탈퇴 실패',
          description: `탈퇴 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
