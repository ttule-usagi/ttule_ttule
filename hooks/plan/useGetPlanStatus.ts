import { useMemo } from 'react';

import { getPlanStatus, PlanStatus } from '@/lib/utils/getPlanStatus';
import { PlanOverview } from '@/types/plan';

export const useGetPlanStatus = (plans: PlanOverview[]) => {
  const {
    current: currentPlans,
    upcomingDecided: upcomingDecidedPlans,
    upcomingUndecided: upcomingUndecidedPlans,
    last: lastPlans,
  } = useMemo(
    () =>
      (plans ?? []).reduce(
        (acc, plan) => {
          const status = getPlanStatus({
            departure: plan.departureDate,
            arrival: plan.arrivalDate,
            isDateUndecided: plan.isDateUndecided,
          });
          acc[status].push(plan);
          return acc;
        },
        { current: [], upcomingDecided: [], upcomingUndecided: [], last: [] } as Record<PlanStatus, PlanOverview[]>,
      ),
    [plans],
  );

  return {
    currentPlans,
    upcomingPlans: [...upcomingDecidedPlans, ...upcomingUndecidedPlans],
    lastPlans,
  };
};
