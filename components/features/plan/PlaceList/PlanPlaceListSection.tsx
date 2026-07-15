'use client';

import { memo, useState } from 'react';
import { useGetAllPlaceLists } from '@/hooks/place-list/useGetAllPlaceLists';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { PlanPlaceListItem } from './PlanPlaceListItem';
import PlanPlaceListDetail from './PlanPlaceListDetail';

export const PlanPlaceListSection = memo(function PlanPlaceListSection({ planId }: { planId: string }) {
  const [selectedList, setSelectedList] = useState<{ id: string; title: string } | null>(null);
  const { data: ownedLists } = useGetAllPlaceLists('owned');
  const { data: sharedLists } = useGetAllPlaceLists('shared');

  // selectedListId가 있으면 상세 뷰로 전환
  if (selectedList) {
    return (
      <QueryBoundary>
        <PlanPlaceListDetail
          listId={selectedList.id}
          planId={planId}
          title={selectedList.title}
          onBack={() => setSelectedList(null)}
        />
      </QueryBoundary>
    );
  }
  return (
    <div className='flex flex-col gap-11'>
      {/* 내 장소 리스트 */}
      <div className='flex flex-col gap-3'>
        <p className='text-typo-big-title font-semibold text-brand-blue-700 mb-3'>저장된 장소 리스트</p>
        {ownedLists.items.length === 0 ? (
          <div className='flex min-h-20 justify-center items-center'>
            <p className='text-typo-description text-brand-gray-400 text-center'>장소 리스트가 아직 없습니다.</p>{' '}
          </div>
        ) : (
          ownedLists.items.map((place) => (
            <PlanPlaceListItem
              key={place.id}
              place={place}
              onClick={() => setSelectedList({ id: place.id, title: place.title })}
            />
          ))
        )}
      </div>

      {/* 공유된 장소 리스트 */}
      <div className='flex flex-col gap-3'>
        <p className='text-typo-title font-semibold text-brand-blue-700'>공유된 장소 리스트</p>
        {sharedLists.items.length === 0 ? (
          <div className='flex min-h-20 justify-center items-center'>
            <p className='text-typo-description text-brand-gray-400 text-center'>초대된 장소 리스트가 아직 없습니다.</p>
          </div>
        ) : (
          sharedLists.items.map((place) => (
            <PlanPlaceListItem
              key={place.id}
              place={place}
              onClick={() => setSelectedList({ id: place.id, title: place.title })}
            />
          ))
        )}
      </div>
    </div>
  );
});
