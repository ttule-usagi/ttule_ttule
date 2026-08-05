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
        <div className='w-full pt-4 text-brand-gray-400'>
          아직 지난 여행이 없습니다.
          <br />
          여행 일정이 종료되면 이곳에서 다시 확인할 수 있습니다.
        </div>
      )}
    </>
  );
}
