// components/features/search/CoreSearchContainer.tsx
'use client';

import { useState } from 'react';
import CoreSearchResultList from './CoreSearchResultList';
import GoogleMapEmbed from '@/components/features/map/GoogleMapEmbed';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import type { PlaceSearchResult } from '@/types/CorePlace';

interface CoreSearchContainerProps {
  keyword: string;
}

export default function CoreSearchContainer({ keyword }: CoreSearchContainerProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  return (
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
            onPlaceSelect={(id) => setSelectedPlaceId(id)}
          />
        </QueryBoundary>
      </div>
    </div>
  );
}
