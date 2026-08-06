import { useMemo } from 'react';

import { getPlanStatus, PlanStatus } from '@/lib/utils/getPlanStatus';
import { PlanOverview } from '@/types/plan';

export const useGetPlanStatus = (plans: PlanOverview[]) => {
  const {
    current: currentPlans,
    upcoming: upcomingPlans,
    last: lastPlans,
  } = useMemo(
    () =>
      (plans ?? []).reduce(
        (acc, plan) => {
          const status = getPlanStatus({
            departure: plan.departureDate,
            arrival: plan.arrivalDate,
            isDateUndecided: plan.isDateUndecided,
            needCurrent: true,
          });
          acc[status].push(plan);
          return acc;
        },
        { current: [], upcoming: [], last: [] } as Record<PlanStatus, PlanOverview[]>,
      ),
    [plans],
  );

  return {
    currentPlans,
    upcomingPlans,
    lastPlans,
  };
};
