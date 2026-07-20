'use client';

import Image from 'next/image';
import type { CorePlaceDetail } from '@/types/CorePlace';
import { Icon } from '@/components/common/Icon';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';

interface CorePlaceDetailProps {
  data: CorePlaceDetail;
  onClose?: () => void;
  onAddToSchedule?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onWriteReview?: () => void;
}

export default function CorePlaceDetail({
  data,
  onClose,
  onAddToSchedule,
  onSave,
  onShare,
  onWriteReview,
}: CorePlaceDetailProps) {
  const { place, images, reviews, savedLists } = data;
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const savedListNames = savedLists.map((l) => l.title).join(', ');
  const isSaved = savedLists.length > 0;

  const categoryLabel = getPlaceCategoryLabel(place.category);

  return (
    <div className='bg-white  overflow-hidden relative w-full'>
      {/* 커버 이미지 */}
      <div className='relative h-60 w-full'>
        {mainImage ? (
          <Image
            src={mainImage.imgUrl}
            alt={place.koreanName}
            fill
            className='object-cover '
          />
        ) : (
          <div className='w-full h-full bg-brand-gray-100 rounded-lg ' />
        )}
      </div>

      {/* 닫기 버튼 */}
      {onClose && (
        <button
          onClick={onClose}
          className='absolute top-4 right-4 bg-white rounded-full size-8 flex items-center justify-center z-10'
          aria-label='닫기'
        >
          <Icon
            name='XClose'
            size={24}
          />
        </button>
      )}

      {/* 장소 기본 정보 */}
      <div className='px-4 pt-5 pb-4 flex flex-col gap-2'>
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

      {/* 액션 버튼 + 저장된 리스트 */}
      <div className='flex flex-col gap-4 px-4 pb-5'>
        <div className='flex gap-2 items-center'>
          {/* 일정에 추가 */}
          <button
            onClick={onAddToSchedule}
            className='flex-1 flex items-center justify-center rounded-lg gap-2.5 px-3.5 py-2.5 border border-brand-gray-200 bg-white'
          >
            <Icon
              name='CalendarPlus'
              size={18}
            />
            <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>일정추가</span>
          </button>

          {/* 저장 */}
          <button
            onClick={onSave}
            className={`flex-1 flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-lg border ${
              isSaved ? 'bg-brand-blue-50 border-brand-blue-200' : 'bg-white border-brand-gray-200'
            }`}
          >
            <Icon
              name='Bookmark'
              size={18}
            />
            <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
              {isSaved ? `저장됨(${savedLists.length})` : '리스트 저장'}
            </span>
          </button>

          {/* 공유 */}
          <button
            onClick={onShare}
            className='flex items-center justify-center p-2 border border-brand-gray-200 rounded-lg bg-white'
            aria-label='공유'
          >
            <Icon
              name='Share'
              size={24}
            />
          </button>
        </div>

        {/* 저장된 리스트 이름 */}
        {isSaved && savedListNames && (
          <p className='text-typo-description text-brand-gray-600'>{savedListNames}에 저장됨</p>
        )}
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 장소 상세 정보 */}
      <div className='flex flex-col gap-3 px-4 py-5'>
        {/* 주소 */}
        {place.address && (
          <div className='flex gap-4 items-start'>
            <div className='flex items-center px-1 shrink-0'>
              <Icon
                name='Map'
                size={18}
              />
            </div>
            <p className='text-typo-description text-brand-gray-500'>{place.address}</p>
          </div>
        )}

        {/* 영업시간 */}
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 items-start'>
            <div className='flex items-center px-1 shrink-0'>
              <Icon
                name='Clock'
                size={18}
              />
            </div>
            <p className='text-typo-description text-brand-gray-500'>영업시간 확인 안됨</p>
          </div>
          <div className='flex gap-2 items-center bg-brand-blue-50 px-2 py-2 rounded-sm'>
            <Icon
              name='Announcement'
              size={16}
            />
            <p className='text-typo-caption text-brand-gray-500 whitespace-nowrap'>
              정확한 영업시간은 구글맵에서 확인해주세요
            </p>
          </div>
        </div>

        {/* 웹사이트 */}
        {place.websiteUri && (
          <div className='flex gap-4 items-start'>
            <div className='flex items-center px-1 shrink-0'>
              <Icon
                name='Globe'
                size={24}
              />
            </div>
            <a
              href={place.websiteUri}
              target='_blank'
              rel='noopener noreferrer'
              className='text-typo-description text-brand-gray-500 underline'
            >
              {place.websiteUri.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* 외부 링크 버튼 */}
      <div className='flex gap-2 px-4 pb-5'>
        {/* 네이버에서 보기 */}
        <a
          href={`https://map.naver.com/v5/search/${encodeURIComponent(place.koreanName)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 border border-brand-gray-200 rounded-lg bg-white'
        >
          <span className='text-3 font-bold text-[#03C75A]'>N</span>
          <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
            네이버에서 보기
          </span>
        </a>

        {/* 구글에서 보기 */}
        <a
          href={`https://www.google.com/maps/place/?q=place_id:${place.googlePlaceId}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-1 flex items-center justify-center gap-1.5 px-3 py-[11px] border border-brand-gray-200 rounded-lg bg-white'
        >
          <Icon
            name='Google'
            size={15}
          />
          <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>구글에서 보기</span>
        </a>
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 리뷰 섹션 */}
      <div className='flex flex-col gap-3.5 px-4 py-5'>
        <div className='flex items-center gap-1'>
          <span className='text-typo-base-bold text-brand-gray-600'>리뷰</span>
          <span className='text-typo-base-bold text-brand-gray-400'>{place.reviewCount}</span>
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
                <span className='text-typo-description text-brand-gray-500'>
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
              <p className='text-typo-description text-brand-gray-600'>{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return '오늘';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}달 전`;
  return `${Math.floor(diffDays / 365)}년전`;
}
