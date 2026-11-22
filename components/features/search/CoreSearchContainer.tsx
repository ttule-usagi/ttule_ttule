// components/features/search/CoreSearchContainer.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import GoogleMapEmbed from '@/components/features/map/GoogleMapEmbed';
import { useOpenPlaceDetailModal } from '@/hooks/place/useOpenPlaceDetailModal';

import CorePlaceDetailContainer from '../place/CorePlaceDetailContainer';

import CoreSearchResultList from './CoreSearchResultList';

interface CoreSearchContainerProps {
  keyword: string;
}

const MD_QUERY = '(min-width: 768px)';

export default function CoreSearchContainer({ keyword }: CoreSearchContainerProps) {
  const router = useRouter();

  const [selectedPlace, setSelectedPlace] = useState<{ googlePlaceId: string; id: string } | null>(null);
  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();
  const [currentKeyword, setCurrentKeyword] = useState(keyword);

  if (currentKeyword !== keyword) {
    setCurrentKeyword(keyword);
    setSelectedPlace(null);
  }

  // 해상도에 따른 장소 상세 분기
  const handlePlaceSelect = (place: { googlePlaceId: string; id: string }) => {
    if (window.matchMedia(MD_QUERY).matches) {
      setSelectedPlace(place); // PC: 지도 마커 갱신 + 우측 모달
      handleClickPlaceItem(place.id);
    } else {
      router.push(`/places/detail/${place.id}`); // 모바일: 상세 페이지 이동
    }
  };

  return (
    <>
      <div className='pt-20 md:pt-0 px-4 pb-28 md:pb-7 h-full overflow-y-auto'>
        {/* 지도 */}
        <div className='hidden md:block md:fixed md:inset-y-0 md:right-0 md:left-118'>
          <GoogleMapEmbed
            mode={selectedPlace ? 'place' : 'view'}
            googlePlaceId={selectedPlace?.googlePlaceId ?? undefined}
          />
        </div>

        {/* 검색 결과 패널 */}
        <div className='w-full flex flex-col'>
          <QueryBoundary>
            <CoreSearchResultList
              keyword={keyword}
              onPlaceSelect={handlePlaceSelect}
            />
          </QueryBoundary>
        </div>
      </div>
      {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div className='absolute left-120 w-90 rounded-lg overflow-hidden flex flex-col max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain z-20'>
            <QueryBoundary>
              <CorePlaceDetailContainer
                placeId={selectedPlace?.id ?? ''}
                onClose={handleClosePlaceDetailModal}
                isPadding={false}
              />
            </QueryBoundary>
          </div>,
          document.body,
        )}
    </>
  );
}
