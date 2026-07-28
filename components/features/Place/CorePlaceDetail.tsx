'use client';

import type { CorePlaceDetail } from '@/types/CorePlace';
import { Icon } from '@/components/common/Icon';
import ExternalLinkButton from './detail/ExternalLinkButton';
import BusinessHours from './detail/info/BusinessHours';
import Address from './detail/info/Address';
import ReviewContainer from './detail/review/ReviewContainer';
import WebsiteUri from './detail/info/WebsiteUri';
import PlaceInfoHeader from './detail/info/PlaceInfoHeader';
import PlaceImage from './detail/info/PlaceImage';
import PlaceActionBar from './detail/PlaceActionBar';
import { getGoogleLink, getNaverLink } from '@/lib/utils/getExternalLink';

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

  const savedListNames = savedLists.map((l) => l.title).join(', ');
  const isSaved = savedLists.length > 0;

  return (
    <div className='bg-white relative w-full pb-40'>
      {/* 커버 이미지 */}
      <PlaceImage
        images={images}
        koreanName={place.koreanName}
      />

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
      <PlaceInfoHeader place={place} />

      {/* 액션 버튼 + 저장된 리스트 */}
      <div className='flex flex-col gap-4 pb-5'>
        <PlaceActionBar
          onAddToSchedule={onAddToSchedule}
          onSave={onSave}
          onShare={onShare}
          savedListsCount={savedLists.length}
          isSaved={isSaved}
        />

        {/* 저장된 리스트 이름 */}
        {isSaved && savedListNames && (
          <p className='text-typo-description text-brand-gray-600'>{savedListNames}에 저장됨</p>
        )}
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 장소 상세 정보 */}
      <div className='flex flex-col gap-3 py-5 w-full'>
        {/* 주소 */}
        {place.address && <Address address={place.address} />}

        {/* 영업시간 */}
        <BusinessHours />

        {/* 웹사이트 */}
        {place.websiteUri && <WebsiteUri websiteUri={place.websiteUri} />}
      </div>

      {/* 외부 링크 버튼 */}
      <div className='flex gap-2 pb-5'>
        {/* 네이버에서 보기 */}
        <ExternalLinkButton
          type='naver'
          link={getNaverLink(place.koreanName)}
        />

        {/* 구글에서 보기 */}
        <ExternalLinkButton
          type='google'
          link={getGoogleLink(place.googlePlaceId)}
        />
      </div>

      {/* 구분선 */}
      {/* <hr className='border-brand-gray-200' /> */}

      {/* 리뷰 섹션 - 2차 적용 */}
      {/* <ReviewContainer
        reviewCount={place.reviewCount}
        reviews={reviews}
        onWriteReview={onWriteReview}
      /> */}
    </div>
  );
}
