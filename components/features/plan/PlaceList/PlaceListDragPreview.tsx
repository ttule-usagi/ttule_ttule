import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import type { Place } from '@/types/placeList';

export function PlaceListDragPreview({ place }: { place: Place }) {
  return (
    <div className='bg-brand-gray-0 rounded-sm border border-brand-blue-700 p-3 shadow-lg flex items-center gap-2 w-70'>
      {place.thumbnail && (
        <img
          src={place.thumbnail}
          alt=''
          className='size-12 rounded-xs object-cover shrink-0'
        />
      )}
      <div className='flex flex-col min-w-0'>
        <p className='text-typo-base-bold text-brand-blue-700 truncate'>{place.customName}</p>
        {place.category && (
          <p className='text-typo-description text-brand-gray-400'>{getPlaceCategoryLabel(place.category)}</p>
        )}
      </div>
    </div>
  );
}
