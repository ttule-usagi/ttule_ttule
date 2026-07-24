'use client';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import TagList from '../tag/TagList';
import PlaceListPlaces from './PlaceListPlaces';
import { SortType } from '@/types/placeList';
import { useState } from 'react';
import SortingDropdownButton from './SortingDropdownButton';

export default function PlaceListContent({ listId }: { listId: string }) {
  const [sortBy, setSortBy] = useState<SortType>('created_desc');
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-2 text-typo-description items-center'>
        {/* 장소 정렬 버튼 */}
        <SortingDropdownButton
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        {/* <QueryBoundary subject='태그'>
          <TagList listId={listId} />
        </QueryBoundary> */}
      </div>
      <QueryBoundary subject='저장된 장소'>
        <PlaceListPlaces
          listId={listId}
          sortBy={sortBy}
        />
      </QueryBoundary>
    </div>
  );
}
