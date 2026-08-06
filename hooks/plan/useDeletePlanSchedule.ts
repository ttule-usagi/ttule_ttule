import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlanSchedule } from '@/lib/actions/plan';
import { ActionResult } from '@/types/errors';

export const useDeletePlanSchedule = ({ planId }: { planId: string }) => {
  const queryClient = useQueryClient();
  return useMutation<ActionResult<null>, Error, string>({
    mutationFn: (scheduleId) => deletePlanSchedule(scheduleId),
    onSuccess: (result) => {
      if (!result.success) return;
      // 접두사 매칭: ['plan', planId, 'detail'], ['plan', planId, 'schedules'],
      // ['plan', planId, 'items', scheduleId] 등 이 plan에 속한 모든 캐시를 한 번에 무효화
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
    },
  });
};
