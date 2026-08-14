import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanItemTransitMemo } from '@/lib/actions/planItem';
import { ActionResult, RpcError } from '@/types/errors';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

export const useUpdateRouteMemo = ({ planId, scheduleId }: { planId: string; scheduleId: string }) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, RpcError, Parameters<typeof updatePlanItemTransitMemo>[0]>({
    mutationFn: async (params) => {
      const result = await updatePlanItemTransitMemo(params);
      if (!result.success) throw new RpcError(result.error.message, result.error.code);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleItemsQueryOptions(planId, scheduleId).queryKey });
    },
  });
};
