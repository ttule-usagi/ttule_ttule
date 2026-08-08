import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pastePlanItems } from '@/lib/actions/planItem';
import { ActionResult, RpcError } from '@/types/errors';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

export const usePastePlanItems = ({ planId }: { planId: string }) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, RpcError, { sourceScheduleId: string; targetScheduleId: string }>({
    mutationFn: async ({ sourceScheduleId, targetScheduleId }) => {
      const result = await pastePlanItems(sourceScheduleId, targetScheduleId);
      if (!result.success) throw new RpcError(result.error.message, result.error.code);
      return result;
    },
    onSuccess: (_, { targetScheduleId }) => {
      queryClient.invalidateQueries({ queryKey: scheduleItemsQueryOptions(planId, targetScheduleId).queryKey });
    },
  });
};
