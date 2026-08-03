import { useMutation, useQueryClient } from '@tanstack/react-query';

import { movePlanItem } from '@/lib/actions/planItem';
import { ActionResult } from '@/types/errors';
import type { PlanItem, PlanTransitMode } from '@/types/plan';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

interface UseMovePlanItemParams {
  planId: string;
}

interface MovePlanItemVariables {
  itemId: string;
  newOrder: number;
  sourceScheduleId: string;
  targetScheduleId?: string;
  transitMode?: PlanTransitMode;
}

interface MovePlanItemContext {
  previousItems: PlanItem[] | undefined;
  queryKey: ReturnType<typeof scheduleItemsQueryOptions>['queryKey'];
}

// useMovePlanItem.ts
export const useMovePlanItem = ({ planId }: UseMovePlanItemParams) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, Error, MovePlanItemVariables, MovePlanItemContext>({
    mutationFn: ({ itemId, newOrder, targetScheduleId, transitMode }) =>
      movePlanItem({ itemId, newOrder, targetScheduleId, transitMode }),

    onMutate: async (variables) => {
      const queryKey = scheduleItemsQueryOptions(planId, variables.sourceScheduleId).queryKey;
      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData<PlanItem[]>(queryKey);

      queryClient.setQueryData<PlanItem[]>(queryKey, (old) => {
        if (!old) return old;
        const updated = old.map((item) =>
          item.id === variables.itemId ? { ...item, order: variables.newOrder } : item,
        );
        return updated.sort((a, b) => a.order - b.order);
      });

      return { previousItems, queryKey };
    },

    onError: (_err, _variables, context) => {
      // 실패 시 롤백
      if (context?.previousItems) {
        queryClient.setQueryData(context.queryKey, context.previousItems);
      }
    },

    onSuccess: (result, variables) => {
      if (!result.success) return;
      // 서버 확정 데이터로 최종 동기화
      queryClient.invalidateQueries({
        queryKey: scheduleItemsQueryOptions(planId, variables.sourceScheduleId).queryKey,
      });
    },
  });
};
