import { Icon } from '@/components/common/Icon';
import { CorePlaceSearchResult, PLACE_CATEGORIES } from '@/types/CorePlace';
import Link from 'next/link';

interface CorePlaceSearchResultItemProps {
  result: CorePlaceSearchResult;
}

const getCategoryLabel = (category: CorePlaceSearchResult['category']) => {
  return PLACE_CATEGORIES.find((item) => item.value === category)?.label ?? null;
};

export default function CorePlaceSearchResultItem({ result }: CorePlaceSearchResultItemProps) {
  const categoryLabel = getCategoryLabel(result.category);

  return (
    <div className='flex flex-col gap-1.5 p-3 border border-brand-gray-300 rounded-sm bg-brand-gray-0 hover:bg-brand-gray-50 transition-colors'>
      <div className='flex items-center justify-between'>
        <p className='text-typo-sub-title text-brand-gray-600 font-medium'>{result.name}</p>
      </div>
      <div className='flex gap-0.5 flex-col'>
        <div className='flex gap-2 items-center'>
          {categoryLabel && <p className='text-typo-description text-brand-gray-500'>{categoryLabel}</p>}
          {result.averageRating !== 0 && (
            <div>
              {' '}
              <Icon
                name='RatingStar'
                size={16}
              />
              <span className='text-typo-description text-brand-gray-400'>{result.averageRating}</span>
            </div>
          )}
          {result.savedCount !== 0 && (
            <span className='text-typo-description text-brand-gray-400'>저장 {result.savedCount}</span>
          )}
        </div>
        <p className='text-typo-description text-brand-gray-400'>{result.address}</p>
      </div>
    </div>
  );
}
