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
  newOrder?: number;
  sourceScheduleId: string;
  targetScheduleId?: string;
  transitMode?: PlanTransitMode;
}

interface MovePlanItemContext {
  previousItems: PlanItem[] | undefined;
  queryKey: ReturnType<typeof scheduleItemsQueryOptions>['queryKey'];
}

export const useMovePlanItem = ({ planId }: UseMovePlanItemParams) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, Error, MovePlanItemVariables, MovePlanItemContext>({
    mutationFn: ({ itemId, newOrder, targetScheduleId, transitMode }) =>
      movePlanItem({ itemId, newOrder, targetScheduleId, transitMode }),

    onMutate: async (variables) => {
      const queryKey = scheduleItemsQueryOptions(planId, variables.sourceScheduleId).queryKey;
      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData<PlanItem[]>(queryKey);

      // newOrder가 명시된 경우(같은 일차 내 재정렬)에만 낙관적으로 순서 반영
      if (variables.newOrder !== undefined) {
        const newOrder = variables.newOrder; // 로컬 상수로 좁혀서 클로저 안에서도 number로 유지
        queryClient.setQueryData<PlanItem[]>(queryKey, (old) => {
          if (!old) return old;
          const updated = old.map((item) => (item.id === variables.itemId ? { ...item, order: newOrder } : item));
          return [...updated].sort((a, b) => a.order - b.order);
        });
      }

      return { previousItems, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(context.queryKey, context.previousItems);
      }
    },

    onSuccess: (result, variables) => {
      if (!result.success) return;

      // 원래(또는 재정렬된) 일차 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: scheduleItemsQueryOptions(planId, variables.sourceScheduleId).queryKey,
      });

      // 다른 일차로 이동한 경우, 대상 일차 캐시도 함께 갱신
      if (variables.targetScheduleId && variables.targetScheduleId !== variables.sourceScheduleId) {
        queryClient.invalidateQueries({
          queryKey: scheduleItemsQueryOptions(planId, variables.targetScheduleId).queryKey,
        });
      }
    },
  });
};
