import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { PlanItem } from '@/types/plan';

// PlanDragPreview.tsx (신규, 최소한의 표시만)
export function PlanDragPreview({ item }: { item: PlanItem }) {
  const categoryLabel = item.placeCategory ? getPlaceCategoryLabel(item.placeCategory) : null;
  return (
    <div className='relative bg-brand-gray-0 rounded-sm border border-brand-blue-700 p-4 shadow-lg min-h-20 overflow-hidden flex flex-col gap-1 cursor-grab'>
      <p className='text-typo-base-bold xl:text-typo-sub-title text-brand-blue-600'>{item.placeName}</p>
      <p className='text-typo-base text-brand-gray-400 m1-1'>
        {item.type === 'memo' ? item.memoContent : categoryLabel}
      </p>
    </div>
  );
}
