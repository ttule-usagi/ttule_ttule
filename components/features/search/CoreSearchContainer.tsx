// components/features/search/CoreSearchContainer.tsx
'use client';

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

export default function CoreSearchContainer({ keyword }: CoreSearchContainerProps) {
  const [selectedPlace, setSelectedPlace] = useState<{ googlePlaceId: string; id: string } | null>(null);
  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();
  const [currentKeyword, setCurrentKeyword] = useState(keyword);

  if (currentKeyword !== keyword) {
    setCurrentKeyword(keyword);
    setSelectedPlace(null);
  }

  return (
    <>
      <div className='px-4 pb-7 h-full overflow-y-auto'>
        {/* 지도 */}
        <div className='absolute inset-0 ml-118'>
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
              onPlaceSelect={(place) => {
                setSelectedPlace(place);
                handleClickPlaceItem(place.id);
              }}
            />
          </QueryBoundary>
        </div>
      </div>
      {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div className='absolute left-120 w-90 rounded-lg overflow-y-auto max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain'>
            <QueryBoundary>
              <CorePlaceDetailContainer
                placeId={selectedPlace?.id ?? ''}
                onClose={handleClosePlaceDetailModal}
              />
            </QueryBoundary>
          </div>,
          document.body,
        )}
    </>
  );
}
