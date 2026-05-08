'use client';

import LobbyPlanActionMenu from './LobbyPlanActionMenu';

interface LobbyPlanItemProps {
  id: number;
  destination: string;
  departure: string;
  arrival: string;
  planName: string;
  party: string;
  updatedAt: string;
}

export default function LobbyPlanItem({
  id,
  destination,
  departure,
  arrival,
  planName,
  party,
  updatedAt,
}: LobbyPlanItemProps) {
  return (
    <div className="max-w-[275.76px] aspect-[275.76/397.69] bg-[url('/images/lobby-plan.svg')] bg-center bg-cover px-4 pt-19.25 pb-6 flex flex-col drop-shadow-lg">
      <div className='flex justify-end'>
        <LobbyPlanActionMenu id={id} />
      </div>

      {/* 목적지 */}
      <p className='mt-4.5 font-paperlogy-semi-bold text-[101px] text-brand-blue-700 leading-none tracking-[-3px] text-center'>
        {destination || 'KOR'}
      </p>

      {/* 여행 기간 */}
      <div className='flex gap-14.5 font-paperlogy-regular text-[15px] text-brand-gray-500 leading-none tracking-[-1.1%] justify-between items-center mt-14.5 w-full'>
        <span>{departure}</span>
        <span>{arrival}</span>
      </div>

      {/* 이외의 정보 */}
      <div className='mt-6 text-[12px] font-extralight text-brand-gray-800 w-full'>
        <p className='flex justify-between'>
          <span>plan name</span>
          {planName}
        </p>
        <p className='flex justify-between'>
          <span>party</span>
          {party}
        </p>
        <p className='flex justify-between'>
          <span>updated</span>
          {updatedAt}
        </p>
      </div>
    </div>
  );
}
