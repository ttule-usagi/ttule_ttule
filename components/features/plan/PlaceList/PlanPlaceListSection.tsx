'use client';

import PlanPlaceListDetail from './PlanPlaceListDetail';
import { PlanPlaceListItem } from './PlanPlaceListItem';
import { useState } from 'react';
import { useGetAllPlaceLists } from '@/hooks/place-list/useGetAllPlaceLists';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';

export function PlanPlaceListSection({ planId, scheduleId }: { planId: string; scheduleId: string }) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { data: ownedLists } = useGetAllPlaceLists('owned');
  const { data: sharedLists } = useGetAllPlaceLists('shared');

  // selectedListId가 있으면 상세 뷰로 전환
  if (selectedListId) {
    return (
      <QueryBoundary>
        <PlanPlaceListDetail
          listId={selectedListId}
          planId={planId}
          scheduleId={scheduleId}
          onBack={() => setSelectedListId(null)}
        />
      </QueryBoundary>
    );
  }
  return (
    <div className='flex flex-col gap-5.5'>
      {/* 내 장소 리스트 */}
      <div className='flex flex-col gap-3'>
        <p className='text-typo-big-title font-semibold text-brand-blue-700'>저장된 장소 리스트</p>
        {ownedLists.items.length === 0 ? (
          <p className='text-typo-description text-brand-gray-400'>장소 리스트가 아직 없습니다.</p>
        ) : (
          ownedLists.items.map((place) => (
            <PlanPlaceListItem
              key={place.id}
              place={place}
              onClick={() => setSelectedListId(place.id)}
            />
          ))
        )}
      </div>

      {/* 공유된 장소 리스트 */}
      <div className='flex flex-col gap-3'>
        <p className='text-typo-title font-semibold text-brand-blue-700'>공유된 장소 리스트</p>
        {sharedLists.items.length === 0 ? (
          <p className='text-typo-description text-brand-gray-400'>초대된 장소 리스트가 아직 없습니다.</p>
        ) : (
          sharedLists.items.map((place) => (
            <PlanPlaceListItem
              key={place.id}
              place={place}
              onClick={() => setSelectedListId(place.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
