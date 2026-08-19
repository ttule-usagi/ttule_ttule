import { Icon } from '@/components/common/Icon';
import { CorePlaceReview } from '@/types/corePlace';

import Review from './Review';

interface ReviewContainerProps {
  reviewCount: number;
  reviews: CorePlaceReview[];
  onWriteReview?: () => void;
}

export default function ReviewContainer({ reviewCount, reviews, onWriteReview }: ReviewContainerProps) {
  return (
    <div className='flex flex-col gap-3.5 py-5'>
      <div className='flex items-center gap-1'>
        <span className='text-typo-base-bold text-brand-gray-600'>리뷰</span>
        <span className='text-typo-base-bold text-brand-gray-400'>{reviewCount}</span>
      </div>

      <div className='flex flex-col gap-2'>
        {/* 리뷰 작성 카드 */}
        <div className='border border-brand-gray-200 rounded-sm flex flex-col gap-3 items-center px-3 py-4'>
          <div className='flex flex-col gap-1 items-center'>
            <p className='text-typo-base text-brand-gray-600 text-center'>별점을 남겨보세요!</p>
            {/* 별점 입력 UI — 추후 인터랙티브 컴포넌트로 교체 */}
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Icon
                  name='RatingStar'
                  size={24}
                  key={i}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onWriteReview}
            className='w-full flex items-center justify-center gap-1 py-2 border border-brand-gray-300 rounded-lg'
          >
            <Icon
              name='Edit'
              size={17}
            />
            <span className='text-typo-description text-brand-blue-700 text-center'>리뷰 쓰기</span>
          </button>
        </div>

        {/* 리뷰 목록 */}
        {reviews.map((review) => (
          <Review
            key={review.id}
            review={review}
          />
        ))}
      </div>
    </div>
  );
}
