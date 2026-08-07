import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reorderPlanSchedule } from '@/lib/actions/plan';
import { ActionResult, RpcError } from '@/types/errors';

interface UseReorderPlanScheduleParams {
  planId: string;
}

interface ReorderPlanScheduleVariables {
  scheduleId: string;
  newDayNumber: number;
}

export const useReorderPlanSchedule = ({ planId }: UseReorderPlanScheduleParams) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, RpcError, ReorderPlanScheduleVariables>({
    mutationFn: async ({ scheduleId, newDayNumber }) => {
      const result = await reorderPlanSchedule(scheduleId, newDayNumber);
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
