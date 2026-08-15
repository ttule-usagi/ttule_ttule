'use client';

import { Icon } from '@/components/common/Icon';
import { formatDuration } from '@/lib/utils/minutes';
import { TRANSFORT_EMOJI } from '@/lib/utils/transport';
import { TRANSIT_MODE_LABELS, type PlanTransitMode } from '@/types/plan';

interface TransitInfoProps {
  mode: string;
  time: number | null;
  hasMemo?: boolean;
  onOpenRouteModal: () => void;
}

export default function TransitInfo({ mode, time, hasMemo, onOpenRouteModal }: TransitInfoProps) {
  const modeLabel = TRANSIT_MODE_LABELS[mode as PlanTransitMode] ?? mode;
  const emoji = mode ? (TRANSFORT_EMOJI[mode as PlanTransitMode] ?? '📍') : '📍';

  return (
    <div
      className='flex gap-2 items-center justify-center cursor-pointer hover:bg-brand-blue-800/50 transition-colors'
      onClick={onOpenRouteModal}
    >
      <span className='font-mona12 text-emoji-sm pl-0.5 pb-0.5'>{emoji}</span>

      <p className='text-typo-description text-white font-light'>
        {modeLabel}
        <span className='text-brand-gray-200 px-1'>{` | `}</span>
        {time != null && formatDuration(time)}
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
