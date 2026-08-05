import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import JoinPlanButton from '@/components/features/JoinPlanButton';
import LastTripList from '@/components/features/plan/lobby/LastTripList';
import UpcomingTripList from '@/components/features/plan/lobby/UpcomingTripList';
import { planListQueryOptions } from '@/hooks/plan/useGetUserPlans';
import { getAllPlanListOverview } from '@/lib/actions/api/plan';
import { auth } from '@/lib/utils/auth';
import { getPlanStatus } from '@/lib/utils/getPlanStatus';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { supabaseUser } from '@/lib/utils/supabase';
import { PlanOverview } from '@/types/plan';

export default async function Page() {
  const queryClient = getQueryClient();
  const supabase = await supabaseUser();
  const session = await auth();
  const data = await queryClient.fetchQuery({
    ...planListQueryOptions(),
    queryFn: () => getAllPlanListOverview({ supabase }),
  });

  // 여행 상태에 따라 분류
  const { upcoming: upcomingPlans, last: lastPlans } = (data ?? []).reduce(
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
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='h-full max-w-350 min-w-230 mx-auto mt-5.5 pl-16 pr-16 pb-60'>
        {/* 공지 - 2차 */}
        {/* <NoticeHeader /> */}
        <header className='flex items-center justify-between mt-10'>
          <div className='flex flex-col gap-0'>
            <p className='text-typo-big-title font-semibold text-brand-blue-700'>
              환영해요 {session?.user.username}님!
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
              <QueryBoundary subject='다가오는 여행'>
                <UpcomingTripList plans={upcomingPlans} />
              </QueryBoundary>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
              <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
              지난 여행
            </div>
            <QueryBoundary subject='지난 여행'>
              <LastTripList plans={lastPlans} />
            </QueryBoundary>
          </div>
        </main>
      </div>
    </HydrationBoundary>
  );
}
