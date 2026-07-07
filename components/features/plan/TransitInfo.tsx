'use client';

import { Icon } from '@/components/common/Icon';
import { TRANSIT_MODE_LABELS, type PlanTransitMode } from '@/types/plan';

interface TransitInfoProps {
  mode: string;
  time: number | null;
  hasMemo?: boolean;
}

export default function TransitInfo({ mode, time, hasMemo }: TransitInfoProps) {
  const modeLabel = TRANSIT_MODE_LABELS[mode as PlanTransitMode] ?? mode;

  return (
    <div className='flex gap-[12px] items-center px-[4px]'>
      {/* 이동 수단 아이콘 자리 — 추후 교체 */}
      <div className='h-[16px] w-[19px] bg-white/30 rounded-sm shrink-0' />

      <p className='text-typo-base text-white'>
        {modeLabel}
        <span className='text-brand-gray-200'>{` | `}</span>
        {time != null && `약 ${time}분`}
      </p>

      {hasMemo && (
        <Icon
          name='MessageDots'
          size={20}
          className='text-white/70'
        />
      )}
    </div>
  );
}
