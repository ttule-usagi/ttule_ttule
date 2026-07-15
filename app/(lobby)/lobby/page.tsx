// TODO: 공유 작업 끝나고 서버 컴포넌트로 전환 예정
'use client';

import JoinPlanButton from '@/components/features/JoinPlanButton';
import LobbyLastPlanItem from '@/components/features/plan/lobby/LobbyLastPlanItem';
import LobbyPlanItem from '@/components/features/plan/lobby/LobbyPlanItem';
import NoticeHeader from '@/components/features/NoticeHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useGetUserPlans } from '@/hooks/plan/useGetUserPlans';
import { getTodayDateStr } from '@/lib/utils/date';

export default function Page() {
  const { data } = useGetUserPlans();
  const lastPlans = data?.filter(
    (item) => !item.isDateUndecided && item.arrivalDate && item.arrivalDate < getTodayDateStr(),
  );

  return (
    <div className='h-full max-w-350 min-w-230 mx-auto mt-5.5 pl-16 pr-16 pb-60'>
      <NoticeHeader />
      <header className='flex items-center justify-between mt-10'>
        <div className='flex flex-col gap-0'>
          <p className='text-typo-big-title font-semibold text-brand-blue-700'>환영해요 닉네임님!</p>
          <p className='text-typo-sub-title font-medium text-brand-gray-400'>n개의 다가오는 여행이 있어요</p>
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
            {data &&
              data.map((plan, index) => (
                <div
                  key={plan.id}
                  className={index % 2 !== 0 ? 'rotate-2' : '-rotate-2'}
                >
                  <LobbyPlanItem {...plan} />
                </div>
              ))}
            <Link href='/plan-create'>
              <Image
                src='/images/lobby-create-plan.svg'
                width={272}
                height={392}
                alt='create plan'
                className='w-full h-auto'
              />
            </Link>
          </div>
        </div>

        {lastPlans && (
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
              <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
              지난 여행
            </div>
            <div className='grid grid-cols-[repeat(auto-fill,340px)] gap-3.25'>
              {lastPlans.map((plan) => (
                <LobbyLastPlanItem
                  key={plan.id}
                  {...plan}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
