import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearScheduleItems } from '@/lib/actions/plan';
import { ActionResult, RpcError } from '@/types/errors';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

export const useClearScheduleItems = ({ planId }: { planId: string }) => {
  const queryClient = useQueryClient();
  return useMutation<ActionResult<null>, Error, string>({
    mutationFn: async (scheduleId) => {
      const result = await clearScheduleItems(scheduleId);
      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code);
      }
      return result;
    },

    onSuccess: (result, scheduleId) => {
      queryClient.invalidateQueries({
        queryKey: scheduleItemsQueryOptions(planId, scheduleId).queryKey,
      });
    },
  });
};
