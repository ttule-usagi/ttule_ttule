'use client';

import { useSession } from 'next-auth/react';

import { useGetPlanStatus } from '@/hooks/plan/useGetPlanStatus';
import { useGetAllUserPlans } from '@/hooks/plan/useGetUserPlans';

import JoinPlanButton from '../../JoinPlanButton';

import LastPlanList from './LastPlanList';
import PlanListWithTag from './PlanListWithTag';
import SectionHeader from './SectionHeader';

export default function LobbyPlanSection() {
  const { data: plans } = useGetAllUserPlans();
  const session = useSession();

  // 여행 상태에 따라 분류
  const { currentPlans, upcomingPlans, lastPlans } = useGetPlanStatus(plans);

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
        {currentPlans.length > 0 && (
          <div className='flex flex-col gap-6'>
            <SectionHeader title='현재 여행' />
            <PlanListWithTag plans={currentPlans} />
          </div>
        )}

        <div className='flex flex-col gap-6'>
          <SectionHeader title='다가오는 여행' />
          <PlanListWithTag plans={upcomingPlans} />
        </div>

        <div className='flex flex-col gap-6'>
          <SectionHeader title='지난 여행' />
          <LastPlanList plans={lastPlans} />
        </div>
      </main>
    </>
  );
}
