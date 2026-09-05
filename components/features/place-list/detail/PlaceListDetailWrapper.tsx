'use client';

import { useState } from 'react';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { SortType } from '@/types/placeList';

import TagList from '../tag/TagList';

import PlaceListHeader from './PlaceListHeader';
import PlaceListPlaces from './PlaceListPlaces';
import SortingDropdownButton from './SortingDropdownButton';

export default function PlaceListDetailWrapper({ listId }: { listId: string }) {
  const [sortBy, setSortBy] = useState<SortType>('created_desc');
  const [activeTagIds, setActiveTagIds] = useState<Set<string>>(new Set());

  const handleToggleTag = (id: string) => {
    setActiveTagIds((prev) => {
      const updated = new Set(prev);
      if (prev.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  return (
    <div className='flex flex-col gap-2.5 h-full'>
      {/* sticky 헤더 */}
      <div className='flex-none px-4 flex flex-col gap-5.5'>
        <QueryBoundary subject='리스트 상세정보'>
          <PlaceListHeader listId={listId} />
        </QueryBoundary>
        <div className='flex gap-2 text-typo-description items-center'>
          {/* 장소 정렬 버튼 */}
          <SortingDropdownButton
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <QueryBoundary subject='태그'>
            <TagList
              listId={listId}
              activeTagIds={activeTagIds}
              onToggleTag={handleToggleTag}
            />
          </QueryBoundary>
        </div>
      </div>

      {/* 저장된 장소 */}
      <div className='flex flex-col gap-3 pb-7 px-4 flex-1 overflow-y-auto'>
        <QueryBoundary subject='저장된 장소'>
          <PlaceListPlaces
            listId={listId}
            sortBy={sortBy}
            activeTagIds={activeTagIds}
          />
        </QueryBoundary>
      </div>
    </div>
  );
}
