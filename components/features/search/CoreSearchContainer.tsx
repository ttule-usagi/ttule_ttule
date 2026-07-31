// components/features/search/CoreSearchContainer.tsx
'use client';

import { useEffect, useState } from 'react';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import GoogleMapEmbed from '@/components/features/map/GoogleMapEmbed';

import CoreSearchResultList from './CoreSearchResultList';

interface CoreSearchContainerProps {
  keyword: string;
}

export default function CoreSearchContainer({ keyword }: CoreSearchContainerProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  // const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();

  useEffect(() => {
    setSelectedPlaceId(null);
  }, [keyword]);

  return (
    <>
      <div className=' h-screen'>
        {/* 지도 */}
        <div className='absolute inset-0 ml-118'>
          <GoogleMapEmbed
            mode={selectedPlaceId ? 'place' : 'view'}
            googlePlaceId={selectedPlaceId ?? undefined}
          />
        </div>

        {/* 검색 결과 패널 */}
        <div className='w-full flex flex-col'>
          <QueryBoundary>
            <CoreSearchResultList
              keyword={keyword}
              onPlaceSelect={(id) => {
                setSelectedPlaceId(id);
                // handleClickPlaceItem(id); // corePlaceId 필요
              }}
            />
          </QueryBoundary>
        </div>
      </div>
      {/* {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div className='absolute left-120 w-90 rounded-lg overflow-y-auto max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain'>
            <QueryBoundary>
              <CorePlaceDetailContainer
                placeId={selectedId}
                onClose={handleClosePlaceDetailModal}
              />
            </QueryBoundary>
          </div>,
          document.body,
        )} */}
    </>
  );
}
