'use client';

import { Icon } from '../../common/Icon';
import LobbyPlanActionMenu from './LobbyPlanActionMenu';

interface LobbyLastPlanItemProps {
  id: number;
  destination: string;
  departure: string;
  arrival: string;
  planName: string;
  party: string;
  updatedAt: string;
}

export default function LobbyLastPlanItem({
  id,
  destination,
  departure,
  arrival,
  planName,
  party,
  updatedAt,
}: LobbyLastPlanItemProps) {
  return (
    <div className="bg-[url('/images/lobby-plan-folder.svg')] bg-cover bg-center] min-w-85 aspect-340/252 px-7">
      {/* 여행지 */}
      <div className='w-full flex gap-2.75 items-center justify-center mt-10.75'>
        <div className='w-1.5 h-1.5 rounded-full bg-brand-blue-800'></div>
        <span className='flex-1 text-typo-base font-light text-brand-gray-500'>{destination}</span>

        <LobbyPlanActionMenu />
        {/* <Icon
          name='DotsHorizontal'
          size={24}
          className='self-end text-brand-gray-400'
        /> */}
      </div>

      {/* 계획명 */}
      <p className='text-typo-title text-brand-blue-700 mt-1'>{planName}</p>

      <div className='flex flex-col items-start text-typo-base font-light text-brand-gray-700 mt-19.25 w-full'>
        {/* 여행 기간 */}
        <div className='flex items-center justify-center gap-2.5 w-full'>
          <Icon
            name='Calendar'
            size={16}
          />
          <div className='flex flex-1 items-center justify-start gap-2'>
            <span>{departure}</span>
            <Icon
              name='ArrowRight'
              size={16}
            />
            <span>{arrival}</span>
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
    </div>
  );
}
