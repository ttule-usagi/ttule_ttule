import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanItemTransitMemo } from '@/lib/actions/planItem';
import { ActionResult, RpcError } from '@/types/errors';
import { PlanItem } from '@/types/plan';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

export const useUpdateRouteMemo = ({ planId, scheduleId }: { planId: string; scheduleId: string }) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, RpcError, Parameters<typeof updatePlanItemTransitMemo>[0]>({
    mutationFn: async (params) => {
      const result = await updatePlanItemTransitMemo(params);
      if (!result.success) throw new RpcError(result.error.message, result.error.code);
      return result;
    },
    onSuccess: (_, variables) => {
      const queryKey = scheduleItemsQueryOptions(planId, scheduleId).queryKey;

      queryClient.setQueryData<PlanItem[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((item) =>
          item.id === variables.placeId
            ? {
                ...item,
                transitMode: variables.transitMode,
                transitDistance: variables.transitDistance,
                transitTime: variables.transitTime,
                transitMemo: variables.transitMemo,
              }
            : item,
        );
      });
    },
  });
};
