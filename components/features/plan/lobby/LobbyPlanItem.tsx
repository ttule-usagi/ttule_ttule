// 마찬가지로 자세한 항목은 추후 수정
'use client';

import Link from 'next/link';

import { formatRelativeDate } from '@/lib/utils/date';
import { getDestinationDisplay } from '@/lib/utils/destinationDisplay';
import { PlanOverview } from '@/types/plan';

import LobbyPlanActionMenu from './LobbyPlanActionMenu';

export default function LobbyPlanItem({
  id,
  destination,
  departureDate,
  arrivalDate,
  isDateUndecided,
  title,
  isPublic,
  updatedAt,
  myRole,
}: PlanOverview) {
  const { text, fontSize } = getDestinationDisplay(destination);

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
          planName={title}
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
          <p className='max-w-42 truncate'>{title ? title : 'Untitled'}</p>
        </p>
        <p className='flex justify-between'>
          <span>shared</span>
          {isPublic ? 'public' : 'private'}
        </p>
        <p className='flex justify-between'>
          <span>updated</span>
          {formatRelativeDate(updatedAt)}
        </p>
      </div>
    </Link>
  );
}
