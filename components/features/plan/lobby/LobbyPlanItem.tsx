// 마찬가지로 자세한 항목은 추후 수정
'use client';

import Link from 'next/link';

import { Icon } from '@/components/common/Icon';
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
  const mobile = getDestinationDisplay(destination, 'mobile');
  const desktop = getDestinationDisplay(destination, 'desktop');

  return (
    <div>
      <Link
        className="max-w-[275.76px] aspect-[275.76/397.69] 
      bg-[url('/images/lobby-plan.svg')] dark:bg-[url('/images/lobby-plan-dark.svg')] 
      hidden bg-center bg-cover px-4 pt-19.25 pb-6 md:flex flex-col drop-shadow-lg"
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
            className={`mt-4.5 font-paperlogy-semi-bold  text-brand-blue-700 leading-none tracking-[-3px] text-center ${desktop.fontSize}`}
          >
            {desktop.text}
          </p>
        </div>

        {/* 여행 기간 */}
        <div className='flex gap-14.5 font-paperlogy-regular text-[15px] text-brand-gray-500 leading-none tracking-[-1.1%] justify-between items-center mt-14.5 w-full'>
          <span>{isDateUndecided ? 'FROM-EGGS' : departureDate}</span>
          <span>{isDateUndecided ? 'TO-APPLES' : arrivalDate}</span>
        </div>

        {/* 이외의 정보 */}
        <div className='mt-6 text-[12px] font-extralight text-brand-gray-800 w-full'>
          <div className='flex justify-between'>
            <span>plan name</span>
            <p className='max-w-42 truncate'>{title ? title : 'Untitled'}</p>
          </div>
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

      {/* 모바일 버전 */}
      <Link
        className="@container relative grid md:hidden grid-cols-[39.46%_minmax(0,1fr)_32px] w-full max-w-92.5 aspect-370/96 pr-2 bg-[url('/images/lobby-plan-m.svg')] dark:bg-[url('/images/lobby-plan-dark.svg')] bg-center bg-cover drop-shadow-lg"
        href={`/plan/${id}`}
      >
        {/* 목적지 */}
        <div className='flex pl-[8cqw] pt-7'>
          <p className={`font-paperlogy-medium leading-none tracking-[-0.03em] text-brand-blue-600 ${mobile.fontSize}`}>
            {mobile.text}
          </p>
        </div>

        {/* 계획 정보 */}
        <div className='@container grid gap-0.5 self-start pt-[5.75cqw] pl-4.5 pr-2 text-brand-gray-400'>
          <p className='text-typo-description truncate font-semibold text-brand-blue-700'>
            {title ? title : 'Untitled'}
          </p>
          <div className='flex items-center gap-1 text-typo-caption whitespace-nowrap'>
            <Icon
              name='Calendar'
              size={14}
              className='text-brand-gray-400'
            />
            <span>{isDateUndecided ? 'FROM-EGGS' : departureDate}</span>
            <Icon
              name='ArrowRight'
              size={14}
              className='text-brand-gray-300'
            />
            <span>{isDateUndecided ? 'TO-APPLES' : arrivalDate}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Icon
              name='Clock'
              size={14}
            />
            <p className='text-typo-caption'>{formatRelativeDate(updatedAt)}</p>
          </div>
        </div>

        {/* 더보기 메뉴 */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className='mt-5 flex size-6 items-center justify-center self-start'
        >
          <LobbyPlanActionMenu
            id={id}
            myRole={myRole}
            planName={title}
          />
        </div>
      </Link>
    </div>
  );
}
