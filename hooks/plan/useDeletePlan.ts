import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlan } from '@/lib/actions/plan';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (planId: string) => {
      const result = await deletePlan(planId);

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: (_, planId) => {
      // 삭제하려는 계획 캐시는 삭제
      queryClient.removeQueries({
        queryKey: ['plan', planId],
      });

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['plan'],
      });
    },
    onError: (error: unknown) => {
      console.error('❌ 계획 삭제 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '계획', action: '삭제' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '계획', action: '삭제' });

      open({
        type: 'error',
        props: {
          title: '계획 삭제 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
