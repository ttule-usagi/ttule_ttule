import { PlanOverview } from '@/types/plan';

import LobbyLastPlanItem from './LobbyLastPlanItem';

export default function LastTripList({ plans }: { plans: PlanOverview[] }) {
  return (
    <>
      {plans.length > 0 ? (
        <div className='grid grid-cols-[repeat(auto-fill,340px)] gap-3.25'>
          {plans.map((plan) => (
            <LobbyLastPlanItem
              key={plan.id}
              {...plan}
            />
          ))}
        </div>
      ) : (
        <div className='w-full'>일정이 끝난 여행이 존재하지 않습니다.</div>
      )}
    </>
  );
}
