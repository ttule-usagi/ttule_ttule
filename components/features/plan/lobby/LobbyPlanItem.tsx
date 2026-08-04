// 마찬가지로 자세한 항목은 추후 수정
'use client';

import Link from 'next/link';

import { useGetPlanMyRole } from '@/hooks/plan/useGetPlanMyRole';
import { PlanOverview } from '@/hooks/plan/useGetUserPlans';
import { formatRelativeDate } from '@/lib/utils/date';
import { getDestinationDisplay } from '@/lib/utils/destinationDisplay';

import LobbyPlanActionMenu from './LobbyPlanActionMenu';

export default function LobbyPlanItem({
  id,
  destination,
  departureDate,
  arrivalDate,
  isDateUndecided,
  title,
  memberCount,
  updatedAt,
}: PlanOverview) {
  const formattedUpdatedAt = formatRelativeDate(updatedAt);
  const { text, fontSize } = getDestinationDisplay(destination);

  const { data: myRole } = useGetPlanMyRole(id);

  return (
    <Link
      className="max-w-[275.76px] aspect-[275.76/397.69] bg-[url('/images/lobby-plan.svg')] bg-center bg-cover px-4 pt-19.25 pb-6 flex flex-col drop-shadow-lg"
      href={`/plan/${id}`}
    >
      <div
        className='flex justify-end'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <LobbyPlanActionMenu
          id={id}
          myRole={myRole}
        />
      </div>

      {/* 목적지 */}
      <div className='flex h-30 justify-center items-center text-brand-blue-700'>
        <p
          className={`mt-4.5 font-paperlogy-semi-bold  text-brand-blue-700 leading-none tracking-[-3px] text-center ${fontSize}`}
        >
          {text}
        </p>
      </div>

      {/* 여행 기간 */}
      <div className='flex gap-14.5 font-paperlogy-regular text-[15px] text-brand-gray-500 leading-none tracking-[-1.1%] justify-between items-center mt-14.5 w-full'>
        <span>{isDateUndecided ? 'FROM-EGGS' : departureDate}</span>
        <span>{isDateUndecided ? 'TO-APPLES' : arrivalDate}</span>
      </div>

      {/* 이외의 정보 */}
      <div className='mt-6 text-[12px] font-extralight text-brand-gray-800 w-full'>
        <p className='flex justify-between'>
          <span>plan name</span>
          {title ? title : 'Untitled'}
        </p>
        <p className='flex justify-between'>
          <span>party</span>
          {memberCount > 1 ? 'group' : 'single'}
        </p>
        <p className='flex justify-between'>
          <span>updated</span>
          {formattedUpdatedAt}
        </p>
      </div>
    </Link>
  );
}
