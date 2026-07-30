'use client';

import { Icon } from '@/components/common/Icon';
import { getGoogleLink, getNaverLink } from '@/lib/utils/getExternalLink';
import type { CorePlaceDetail } from '@/types/corePlace';

import PlaceActionBar from './detail/action-bar/PlaceActionBar';
import ExternalLinkButton from './detail/ExternalLinkButton';
import Address from './detail/info/Address';
import BusinessHours from './detail/info/BusinessHours';
import PlaceImage from './detail/info/PlaceImage';
import PlaceInfoHeader from './detail/info/PlaceInfoHeader';
import WebsiteUri from './detail/info/WebsiteUri';

interface CorePlaceDetailProps {
  data: CorePlaceDetail;
  onClose?: () => void;
  onAddToSchedule?: () => void;
  onSave?: () => void;
  onWriteReview?: () => void;
}

export default function CorePlaceDetail({ data, onClose, onAddToSchedule, onSave }: CorePlaceDetailProps) {
  const { place, images, savedLists } = data;

  const savedListNames = savedLists.map((l) => l.title).join(', ');
  const isSaved = savedLists.length > 0;

  return (
    <div className='bg-white w-full relative'>
      {/* 닫기 버튼 */}
      {onClose && (
        <div className='sticky top-4 z-20 h-0 flex justify-end pr-4'>
          <button
            onClick={onClose}
            className='bg-white rounded-full size-8 flex items-center justify-center cursor-pointer'
            aria-label='닫기'
          >
            <Icon
              name='XClose'
              size={24}
              className='text-brand-gray-600'
            />
          </button>
        </div>
      )}

      {/* 커버 이미지 */}
      <PlaceImage
        images={images}
        koreanName={place.koreanName}
      />

      {/* 장소 기본 정보 */}
      <PlaceInfoHeader place={place} />

      {/* 액션 버튼 + 저장된 리스트 */}
      <div className='flex flex-col gap-4 pb-5 px-4'>
        <PlaceActionBar
          onAddToSchedule={onAddToSchedule}
          onSave={onSave}
          savedListsCount={savedLists.length}
          isSaved={isSaved}
        />

        {/* 저장된 리스트 이름 */}
        {isSaved && savedListNames && (
          <p className='text-typo-description text-brand-gray-600'>{`'${savedListNames}'`} 에 저장됨</p>
        )}
      </div>

      {/* 구분선 */}
      <hr className='border-brand-gray-200' />

      {/* 장소 상세 정보 */}
      <div className='flex flex-col gap-3 py-5 w-full px-4'>
        {/* 주소 */}
        {place.address && <Address address={place.address} />}

        {/* 영업시간 */}
        <BusinessHours />

        {/* 웹사이트 */}
        {place.websiteUri && <WebsiteUri websiteUri={place.websiteUri} />}
      </div>

      {/* 외부 링크 버튼 */}
      <div className='flex gap-2 pb-5 px-4'>
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
      {/* <hr className='border-brand-gray-200 -mx-4' /> */}

      {/* 리뷰 섹션 - 2차 적용 */}
      {/* <ReviewContainer
        reviewCount={place.reviewCount}
        reviews={reviews}
        onWriteReview={onWriteReview}
      /> */}
    </div>
  );
}
