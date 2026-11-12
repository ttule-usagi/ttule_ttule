import { PlanOverview } from '@/types/plan';

import CreateNewPlan from './CreateNewPlan';
import LobbyPlanItem from './LobbyPlanItem';

export default function PlanListWithTag({ plans }: { plans: PlanOverview[] }) {
  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-[repeat(auto-fill,275.76px)] md:gap-10.75'>
      {plans.length > 0 &&
        plans.map((plan, index) => (
          <div
            key={plan.id}
            className={index % 2 !== 0 ? 'md:rotate-2' : 'md:-rotate-2'}
          >
            <LobbyPlanItem {...plan} />
          </div>
        ))}
      <CreateNewPlan />
    </div>
  );
}
