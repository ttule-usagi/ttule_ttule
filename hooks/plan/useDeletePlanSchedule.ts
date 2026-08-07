import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlanSchedule } from '@/lib/actions/plan';
import { ActionResult, RpcError } from '@/types/errors';

export const useDeletePlanSchedule = ({ planId }: { planId: string }) => {
  const queryClient = useQueryClient();
  return useMutation<ActionResult<null>, RpcError, string>({
    mutationFn: async (scheduleId) => {
      const result = await deletePlanSchedule(scheduleId);
      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
    },
  });
};
