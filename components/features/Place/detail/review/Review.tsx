import { Icon } from '@/components/common/Icon';
import { formatRelativeTime } from '@/lib/utils/date';
import { CorePlaceReview } from '@/types/corePlace';

export default function Review({ review }: { review: CorePlaceReview }) {
  return (
    <div
      key={review.id}
      className='border border-brand-gray-200 rounded-sm flex flex-col gap-1 p-3'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <span className='text-typo-description text-brand-gray-600'>{review.userId}</span>
          <div className='flex items-center gap-0.5'>
            <Icon
              name='RatingStar'
              size={17}
            />
            <span className='text-typo-description text-brand-gray-600 text-center'>{review.rating}</span>
          </div>
        </div>
        <span className='text-typo-description text-brand-gray-500'>{formatRelativeTime(review.createdAt)}</span>
      </div>
      <p className='text-typo-description text-brand-gray-600'>{review.content}</p>
    </div>
  );
}
