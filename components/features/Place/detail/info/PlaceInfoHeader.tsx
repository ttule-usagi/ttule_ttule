import { Icon } from '@/components/common/Icon';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { CorePlace } from '@/types/CorePlace';

export default function PlaceInfoHeader({ place }: { place: CorePlace }) {
  const categoryLabel = getPlaceCategoryLabel(place.category);

  return (
    <div className='pt-5 pb-4 flex flex-col gap-2'>
      <div className='flex flex-col gap-0.5'>
        {place.koreanName ? (
          <p className='text-typo-sub-title text-brand-gray-600'> {place.koreanName}</p>
        ) : (
          <p className='text-typo-sub-title text-brand-gray-600'>{place.englishName}</p>
        )}
        {place.originalName && <p className='text-typo-base text-brand-gray-500'>{place.originalName}</p>}
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-0.5'>
          <Icon
            name='RatingStar'
            size={24}
          />
          <span className='text-typo-description text-brand-gray-500'>{place.averageRating.toFixed(1)}</span>
          <span className='text-typo-description text-brand-gray-500'>({place.reviewCount})</span>
          <span className='text-typo-description text-brand-gray-500 mx-0.5'>·</span>
          <span className='text-typo-description text-brand-gray-500'>{place.savedCount ?? 0} 저장됨</span>
        </div>
        {categoryLabel && <p className='text-typo-description text-brand-gray-500'>{categoryLabel}</p>}
      </div>
    </div>
  );
}
