import { PlanOverview } from '@/types/plan';

import CreateNewPlan from './CreateNewPlan';
import LobbyPlanItem from './LobbyPlanItem';

export default function UpcomingTripList({ plans }: { plans: PlanOverview[] }) {
  return (
    <>
      {plans.length > 0 &&
        plans.map((plan, index) => (
          <div
            key={plan.id}
            className={index % 2 !== 0 ? 'rotate-2' : '-rotate-2'}
          >
            <LobbyPlanItem {...plan} />
          </div>
        ))}
      <CreateNewPlan />
    </>
  );
}
