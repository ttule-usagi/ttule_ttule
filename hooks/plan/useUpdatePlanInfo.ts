import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanInfo } from '@/lib/actions/plan';
import { ActionResult, RpcError } from '@/types/errors';

export const useUpdatePlanInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<ActionResult<null>, RpcError, Parameters<typeof updatePlanInfo>[0]>({
    mutationFn: async (params) => {
      const result = await updatePlanInfo(params);
      if (!result.success) throw new RpcError(result.error.message, result.error.code);
      return result;
    },
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['plan', 'list'] });
    },
  });
};
