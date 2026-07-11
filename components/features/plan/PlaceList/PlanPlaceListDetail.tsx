'use client';

import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListDetail';
import { Icon } from '@/components/common/Icon';
import { PlanPlaceItem } from './PlanPlaceItem';

interface PlanPlaceListDetailProps {
  listId: string;
  planId: string;
  scheduleId: string;
  onBack: () => void;
}

export default function PlanPlaceListDetail({ listId, planId, scheduleId, onBack }: PlanPlaceListDetailProps) {
  const { data: places } = useGetPlaceListPlaces(listId);

  return (
    <div className='flex flex-col gap-3'>
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className='flex items-center gap-1 text-brand-blue-700 text-typo-description'
      >
        <Icon
          name='ChevronLeft'
          size={20}
          className='text-brand-blue-700'
        />
        목록으로
      </button>

      {places.length === 0 ? (
        <p className='text-typo-description text-brand-gray-400'>저장된 장소가 아직 없습니다.</p>
      ) : (
        places.map((place) => (
          <PlanPlaceItem
            key={place.id}
            place={place}
            planId={planId}
            scheduleId={scheduleId}
          />
        ))
      )}
    </div>
  );
}
