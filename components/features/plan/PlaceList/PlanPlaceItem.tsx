import Image from 'next/image';
import { useState } from 'react';
import { addPlanItem } from '@/lib/actions/planItem';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';
import { Place } from '@/types/placeList';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { useQueryClient } from '@tanstack/react-query';

interface PlanPlaceItemProps {
  place: Place;
  planId: string;
  scheduleId: string;
}

export function PlanPlaceItem({ place, planId, scheduleId }: PlanPlaceItemProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // core_place_id로 상세 정보 조회 (addPlanItem에 필요)
  const { data: placeDetail } = useGetCorePlace(place.corePlaceId);

  const handleAdd = async () => {
    if (!placeDetail) return;
    setIsAdding(true);

    const result = await addPlanItem({ scheduleId, placeDetail });

    setIsAdding(false);

    if (!result.error) {
      setIsDone(true);
      await queryClient.invalidateQueries({
        queryKey: ['plan', planId, 'items', scheduleId],
        refetchType: 'active',
      });
    }
  };

  return (
    <div className='w-full flex gap-3.25 bg-brand-gray-0 p-3 rounded-sm border border-brand-blue-700 items-start'>
      <div className='w-20 h-20 shrink-0 border border-brand-blue-700 rounded-xs bg-brand-blue-50'>
        {place.thumbnail ? (
          <Image
            src={place.thumbnail}
            alt='thumbnail'
            width={80}
            height={80}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-brand-gray-300 text-typo-caption'>
            이미지 없음
          </div>
        )}
      </div>

      <div className='flex flex-col gap-1 flex-1 min-w-0'>
        <p className='text-typo-sub-title text-brand-blue-700 truncate'>{place.customName}</p>
        {place.category && (
          <p className='text-brand-gray-400 text-typo-description'>{getPlaceCategoryLabel(place.category)}</p>
        )}
        {place.memoContent && (
          <p className='text-brand-gray-600 text-typo-description line-clamp-2'>{place.memoContent}</p>
        )}
      </div>

      {/* 일정에 추가 버튼 */}
      <button
        onClick={handleAdd}
        disabled={isAdding || isDone}
        className={`shrink-0 flex items-center justify-center px-[8px] py-[6px] rounded-[4px] text-typo-caption whitespace-nowrap ${
          isDone ? 'bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed' : 'bg-brand-blue-700 text-white'
        }`}
      >
        {isDone ? '추가됨' : isAdding ? '추가 중...' : '+ 추가'}
      </button>
    </div>
  );
}
