import { useMutation, useQueryClient } from '@tanstack/react-query';

import { duplicatePlan } from '@/lib/actions/plan';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';

export const useDuplicatePlan = () => {
  const queryClient = useQueryClient();
  // TODO: 나중에 에러 모달을 토스트 메세지로 교체
  const { open } = useModalStore();

  return useMutation({
    mutationFn: async (planId: string) => {
      const result = await duplicatePlan(planId);

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }

      return result;
    },
    onSuccess: () => {
      // TODO: 복제 성공 시 toast 알림 필요(상세 페이지 내에 있을 때도 복제가 가능하므로)
      queryClient.invalidateQueries({
        queryKey: ['plan', 'list'],
      });
    },
    onError: (error: unknown) => {
      console.error('❌ 계획 복제 실패');

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '계획', action: '복제' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '계획', action: '복제' });

      open({
        type: 'error',
        props: {
          title: '계획 복제 실패',
          description: `${message}\n잠시 후 다시 시도해주세요.`,
        },
      });
    },
  });
};
