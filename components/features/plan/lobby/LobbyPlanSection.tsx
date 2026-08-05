'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import { useGetAllUserPlans } from '@/hooks/plan/useGetUserPlans';
import { getPlanStatus } from '@/lib/utils/getPlanStatus';
import { PlanOverview } from '@/types/plan';

import JoinPlanButton from '../../JoinPlanButton';

import LastTripList from './LastTripList';
import UpcomingTripList from './UpcomingTripList';

export default function LobbyPlanSection() {
  const { data } = useGetAllUserPlans();
  const session = useSession();

  // 여행 상태에 따라 분류
  const { upcoming: upcomingPlans, last: lastPlans } = useMemo(
    () =>
      (data ?? []).reduce(
        (acc, plan) => {
          const status = getPlanStatus({
            departure: plan.departureDate,
            arrival: plan.arrivalDate,
            isDateUndecided: plan.isDateUndecided,
          });
          acc[status].push(plan);
          return acc;
        },
        { upcoming: [], last: [] } as Record<'upcoming' | 'last', PlanOverview[]>,
      ),
    [data],
  );

  return (
    <>
      <header className='flex items-center justify-between mt-10'>
        <div className='flex flex-col gap-0'>
          <p className='text-typo-big-title font-semibold text-brand-blue-700'>
            환영해요 {session.data?.user.username}님!
          </p>
          <p className='text-typo-sub-title font-medium text-brand-gray-400'>
            {upcomingPlans.length}개의 다가오는 여행이 있어요
          </p>
        </div>

        <div className='flex gap-3'>
          <JoinPlanButton variant='secondary' />
        </div>
      </header>
      <main className='mt-22.75 flex flex-col gap-19.5'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
            <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
            다가오는 여행
          </div>
          <div className='grid grid-cols-[repeat(auto-fill,275.76px)] gap-10.75'>
            <UpcomingTripList plans={upcomingPlans} />
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
            <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
            지난 여행
          </div>
          <LastTripList plans={lastPlans} />
        </div>
      </main>
    </>
  );
}
