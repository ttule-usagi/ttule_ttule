'use client';

import Link from 'next/link';

import { Icon } from '@/components/common/Icon';
import LobbyPlanActionMenu from '@/components/features/plan/lobby/LobbyPlanActionMenu';
import { formatRelativeDate } from '@/lib/utils/date';
import { PlanOverview } from '@/types/plan';

export default function LobbyLastPlanItem({
  id,
  destination,
  departureDate,
  arrivalDate,
  title,
  updatedAt,
  myRole,
}: PlanOverview) {
  return (
    <Link
      className="bg-[url('/images/lobby-plan-folder.svg')] dark:bg-[url('/images/lobby-plan-folder-dark.svg')] bg-cover bg-center min-w-85 aspect-340/252 px-7 flex flex-col"
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
          <LobbyPlanActionMenu
            id={id}
            myRole={myRole}
            planName={title}
          />
        </div>
      </div>

      {/* 계획명 */}
      <div className='flex flex-col gap-4 flex-1 min-h-0'>
        <p className='text-typo-title text-brand-blue-700 mt-1 flex-1 min-h-0 line-clamp-3 overflow-hidden'>
          {title ? title : 'Untitled'}
        </p>

        <div className='flex flex-col items-start text-typo-base font-light text-brand-gray-700 w-full self-end mb-6 shrink-0'>
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
            <span className='flex-1'>{formatRelativeDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
