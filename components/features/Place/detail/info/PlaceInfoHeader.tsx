import { Icon } from '@/components/common/Icon';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { CorePlace } from '@/types/CorePlace';

export default function PlaceInfoHeader({ place }: { place: CorePlace }) {
  const categoryLabel = getPlaceCategoryLabel(place.category);

  return (
    <div className='pt-5 pb-4 flex flex-col gap-2 px-4'>
      <div className='flex flex-col gap-0.5'>
        {place.koreanName ? (
          <p className='text-typo-sub-title text-brand-gray-600'> {place.koreanName}</p>
        ) : (
          <p className='text-typo-sub-title text-brand-gray-600'>{place.englishName}</p>
        )}
        {place.originalName && <p className='text-typo-base text-brand-gray-500'>{place.originalName}</p>}
      </div>
      <div className='flex flex-col gap-1 text-typo-description text-brand-gray-500'>
        <div className='flex items-center gap-0.5'>
          <Icon
            name='RoundStar'
            size={14}
            className='mr-0.5'
          />

          <span>{place.averageRating.toFixed(1)}</span>
          <span>({place.reviewCount})</span>
          <span className='mx-0.5'>·</span>
          <span>{place.savedCount ?? 0} 저장됨</span>
        </div>
        {categoryLabel && <p>{categoryLabel}</p>}
      </div>
    </div>
  );
}
