'use client';

import { Icon } from '@/components/common/Icon';
import { TRANSIT_MODE_LABELS, type PlanTransitMode } from '@/types/plan';
import { formatDuration } from '@/lib/utils/minutes';
import { TRANSFORT_EMOJI } from '@/lib/utils/transport';

interface TransitInfoProps {
  mode: string;
  time: number | null;
  hasMemo?: boolean;
}

// function CategoryIcon({ category }: { category: string | null }) {
//   const color = category ? (CATEGORY_COLORS[category as PlaceCategory] ?? '#C0C8E0') : '#C0C8E0';
//   const emoji = category ? (CATEGORY_EMOJI[category as PlaceCategory] ?? '📍') : '📍';

//   return (
//     <div
//       className='flex items-center justify-center rounded-full size-[26px] shrink-0'
//       style={{ backgroundColor: color }}
//     >
//       <span className='font-mona12 text-emoji-sm pl-0.5 pb-0.5'>{emoji}</span>
//     </div>
//   );
// }

export default function TransitInfo({ mode, time, hasMemo }: TransitInfoProps) {
  const modeLabel = TRANSIT_MODE_LABELS[mode as PlanTransitMode] ?? mode;
  const emoji = mode ? (TRANSFORT_EMOJI[mode as PlanTransitMode] ?? '📍') : '📍';

  return (
    <div className='flex gap-2 items-center justify-center'>
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
