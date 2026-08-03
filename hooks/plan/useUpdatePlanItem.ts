// hooks/plan/useUpdatePlanItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanItem } from '@/lib/actions/planItem';
import type { ActionResult } from '@/types/errors';

import { scheduleItemsQueryOptions } from './useGetScheduleItems';

type UpdatePlanItemVariables =
  | { type: 'place'; itemId: string; scheduleId: string; visitTime: string; memoContent: string }
  | { type: 'memo'; itemId: string; scheduleId: string; visitTime: string; memoContent: string };

interface UseUpdatePlanItemParams {
  planId: string;
}

export const useUpdatePlanItem = ({ planId }: UseUpdatePlanItemParams) => {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<null>, Error, UpdatePlanItemVariables>({
    mutationFn: (variables) => {
      if (variables.type === 'place') {
        return updatePlanItem({
          type: 'place',
          itemId: variables.itemId,
          visitTime: variables.visitTime,
          memoContent: variables.memoContent,
        });
      }
      return updatePlanItem({
        type: 'memo',
        itemId: variables.itemId,
        visitTime: variables.visitTime,
        memoContent: variables.memoContent,
      });
    },
    onSuccess: (result, variables) => {
      if (!result.success) return;

      queryClient.invalidateQueries({
        queryKey: scheduleItemsQueryOptions(planId, variables.scheduleId).queryKey,
      });
    },
  });
};
