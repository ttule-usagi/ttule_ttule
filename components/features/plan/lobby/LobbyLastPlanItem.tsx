'use client';

import { PlanOverview } from '@/hooks/plan/useGetUserPlans';
import { Icon } from '@/components/common/Icon';
import LobbyPlanActionMenu from '@/components/features/plan/lobby/LobbyPlanActionMenu';
import Link from 'next/link';

export default function LobbyLastPlanItem({
  id,
  destination,
  departureDate,
  arrivalDate,
  title,
  updatedAt,
}: PlanOverview) {
  return (
    <Link
      className="bg-[url('/images/lobby-plan-folder.svg')] bg-cover bg-center] min-w-85 aspect-340/252 px-7"
      href={`/plan/${id}`}
    >
      {/* 여행지 */}
      <div className='w-full flex gap-2.75 items-center justify-center mt-10.75'>
        <div className='w-1.5 h-1.5 rounded-full bg-brand-blue-800'></div>
        <span className='flex-1 text-typo-base font-light text-brand-gray-500'>{destination}</span>

        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className='flex items-center justify-center'
        >
          <LobbyPlanActionMenu id={id} />
        </div>
      </div>

      {/* 계획명 */}
      <p className='text-typo-title text-brand-blue-700 mt-1'>{title ? title : 'Untitled'}</p>

      <div className='flex flex-col items-start text-typo-base font-light text-brand-gray-700 mt-19.25 w-full'>
        {/* 여행 기간 */}
        <div className='flex items-center justify-center gap-2.5 w-full'>
          <Icon
            name='Calendar'
            size={16}
          />
          <div className='flex flex-1 items-center justify-start gap-2'>
            <span>{departureDate}</span>
            <Icon
              name='ArrowRight'
              size={16}
            />
            <span>{arrivalDate}</span>
          </div>
        </div>

        {/* 업데이트 시간 */}
        <div className='flex items-center justify-center gap-2.5 w-full'>
          <Icon
            name='Clock'
            size={16}
          />
          <span className='flex-1'>{updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}
