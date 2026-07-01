'use client';

import Image from 'next/image';
import type { CorePlaceDetail } from '@/types/CorePlace';
import { Icon } from '@/components/common/Icon';

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

  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden relative w-full'>

      {/* 커버 이미지 */}
      <div className='relative h-[240px] w-full'>
        {mainImage ? (
          <Image
            src={mainImage.imgUrl}
            alt={place.koreanName}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full bg-brand-gray-100' />
        )}
      </div>

      {/* 닫기 버튼 */}
      {onClose && (
        <button
          onClick={onClose}
          className='absolute top-[16px] right-[16px] bg-white rounded-full size-[30px] flex items-center justify-center z-10'
          aria-label='닫기'
        >
         
        <Icon
        name='XClose'
        size={24}
      />
        </button>
      )}

      {/* 장소 기본 정보 */}
      <div className='px-[16px] pt-[20px] pb-[16px] flex flex-col gap-[8px]'>
        <div className='flex flex-col gap-[2px]'>
          <p className='text-typo-sub-title text-brand-gray-600'>
            {place.koreanName}
          </p>
          {place.originalName && (
            <p className='text-typo-base text-brand-gray-500'>
              {place.originalName}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-[3px]'>
          <div className='flex items-center gap-[2px]'>
                  <Icon
        name='RatingStar'
        size={24}
      />
            <span className='text-typo-description text-brand-gray-500'>
              {place.averageRating.toFixed(1)}
            </span>
            <span className='text-typo-description text-brand-gray-500'>
              ({place.reviewCount})
            </span>
            <span className='text-typo-description text-brand-gray-500 mx-[2px]'>·</span>
            <span className='text-typo-description text-brand-gray-500'>
              {place.savedCount ?? 0} 저장됨
            </span>
          </div>
          {place.category && (
            <p className='text-typo-description text-brand-gray-500'>
              {place.category}
            </p>
          )}
        </div>
      </div>

      {/* 액션 버튼 + 저장된 리스트 */}
      <div className='flex flex-col gap-[16px] px-[16px] pb-[20px]'>
        <div className='flex gap-[8px] items-center'>
          {/* 일정에 추가 */}
          <button
            onClick={onAddToSchedule}
            className='flex-1 flex items-center justify-center gap-[6px] px-[14px] py-[11px] border border-brand-gray-200 rounded-[8px] bg-white'
          >
                  <Icon
        name='Plus'
        size={24}
      />
            <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
              일정에 추가
            </span>
          </button>

          {/* 저장 */}
          <button
            onClick={onSave}
            className={`flex-1 flex items-center justify-center gap-[6px] px-[14px] py-[11px] rounded-[8px] border ${
              isSaved
                ? 'bg-brand-blue-50 border-brand-blue-200'
                : 'bg-white border-brand-gray-200'
            }`}
          >
                 <Icon
        name='Bookmark'
        size={24}
      />
            <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
              {isSaved ? `저장됨(${savedLists.length})` : '저장하기'}
            </span>
          </button>

          {/* 공유 */}
          <button
            onClick={onShare}
            className='flex items-center justify-center p-[8px] border border-brand-gray-200 rounded-[8px] bg-white'
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
          <p className='text-typo-description text-brand-gray-600'>
            {savedListNames}에 저장됨
          </p>
        )}
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 장소 상세 정보 */}
      <div className='flex flex-col gap-[12px] px-[16px] py-[20px]'>
        {/* 주소 */}
        {place.address && (
          <div className='flex gap-[16px] items-start'>
            <div className='flex items-center px-[4px] shrink-0'>
                    <Icon
        name='Map'
        size={24}
      />
            </div>
            <p className='text-typo-description text-brand-gray-500'>
              {place.address}
            </p>
          </div>
        )}

        {/* 영업시간 */}
        <div className='flex flex-col gap-[8px]'>
          <div className='flex gap-[16px] items-start'>
            <div className='flex items-center px-[4px] shrink-0'>
                <Icon
                name='Clock'
                size={24}
                />
            </div>
            <p className='text-typo-description text-brand-gray-500'>
              영업시간 확인 안됨
            </p>
          </div>
          <div className='flex gap-[8px] items-center bg-brand-blue-50 px-[10px] py-[8px] rounded-[4px]'>
                  <Icon
        name='Announcement'
        size={24}
      />
            <p className='text-typo-caption text-brand-gray-500 whitespace-nowrap'>
              정확한 영업시간은 구글맵에서 확인해주세요
            </p>
          </div>
        </div>

        {/* 웹사이트 */}
        {place.websiteUri && (
          <div className='flex gap-[16px] items-start'>
            <div className='flex items-center px-[4px] shrink-0'>
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
      <div className='flex gap-[8px] px-[16px] pb-[20px]'>
        {/* 네이버에서 보기 */}
        <a
          href={`https://map.naver.com/v5/search/${encodeURIComponent(place.koreanName)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-1 flex items-center justify-center gap-[8px] px-[14px] py-[11px] border border-brand-gray-200 rounded-[8px] bg-white'
        >
          {/* 네이버 로고는 프로젝트 아이콘으로 교체하세요 */}
          <span className='text-[12px] font-bold text-[#03C75A]'>N</span>
          <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
            네이버에서 보기
          </span>
        </a>

        {/* 구글에서 보기 */}
        <a
          href={`https://www.google.com/maps/place/?q=place_id:${place.googlePlaceId}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-1 flex items-center justify-center gap-[6px] px-[14px] py-[11px] border border-brand-gray-200 rounded-[8px] bg-white'
        >
          {/* 구글 로고는 프로젝트 아이콘으로 교체하세요 */}
          <span className='text-[12px] font-bold text-[#4285F4]'>G</span>
          <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
            구글에서 보기
          </span>
        </a>
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 리뷰 섹션 */}
      <div className='flex flex-col gap-[14px] px-[16px] py-[20px]'>
        <div className='flex items-center gap-[4px]'>
          <span className='text-typo-base-bold text-brand-gray-600'>리뷰</span>
          <span className='text-typo-base-bold text-brand-gray-400'>
            {place.reviewCount}
          </span>
        </div>

        <div className='flex flex-col gap-[8px]'>
          {/* 리뷰 작성 카드 */}
          <div className='border border-brand-gray-200 rounded-[4px] flex flex-col gap-[12px] items-center px-[12px] py-[16px]'>
            <div className='flex flex-col gap-[4px] items-center'>
              <p className='text-typo-base text-brand-gray-600 text-center'>
                별점을 남겨보세요!
              </p>
              {/* 별점 입력 UI — 추후 인터랙티브 컴포넌트로 교체 */}
              <div className='flex gap-[4px]'>
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
              className='w-full flex items-center justify-center gap-[4px] py-[8px] border border-brand-gray-300 rounded-[4px]'
            >
              <Icon
        name='Edit'
        size={24}
      />
              <span className='text-typo-description text-brand-blue-700 text-center'>
                리뷰 쓰기
              </span>
            </button>
          </div>

          {/* 리뷰 목록 */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className='border border-brand-gray-200 rounded-[4px] flex flex-col gap-[4px] p-[12px]'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-[4px]'>
                  <span className='text-typo-description text-brand-gray-600'>
                    {review.userId}
                  </span>
                  <div className='flex items-center gap-[2px]'>
                    <Icon name='RatingStar' size={17} />
                    <span className='text-typo-description text-brand-gray-600 text-center'>
                      {review.rating}
                    </span>
                  </div>
                </div>
                <span className='text-typo-description text-brand-gray-500'>
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
              <p className='text-typo-description text-brand-gray-600'>
                {review.content}
              </p>
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