'use client';

import { useState } from 'react';
import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListDetail';
import { Icon } from '@/components/common/Icon';
import { Place } from '@/types/placeList';
import Image from 'next/image';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import AddToScheduleModal from '@/components/features/Place/save/ScheduleModal';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';

interface PlanPlaceItemProps {
  place: Place;
  planId: string;
}

function PlanPlaceItem({ place, planId }: PlanPlaceItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: placeDetail } = useGetCorePlace(place.corePlaceId);

  return (
    <>
      <div className='w-full flex gap-3.25 bg-brand-gray-0 p-3 rounded-sm border border-brand-blue-700 items-start'>
        <div className='w-16 h-16 xl:w-20 xl:h-20 shrink-0 border border-brand-gray-200 rounded-xs bg-brand-blue-50'>
          {place.thumbnail ? (
            <Image
              src={place.thumbnail}
              alt='thumbnail'
              width={80}
              height={80}
              className='w-full h-full object-cover'
            />
          ) : (
            <Image
              src='/images/not-found.webp'
              alt='thumbnail'
              width={80}
              height={80}
              className='w-full h-full object-cover'
            />
          )}
        </div>

        <div className='flex flex-col gap-1 flex-1 min-w-0'>
          <p className={` text-brand-gray-600 whitespace-break-spaces text-typo-base-bold xl:text-typo-sub-title `}>
            {place.customName}
          </p>
          {place.category && (
            <p className='text-brand-gray-400 text-typo-description'>{getPlaceCategoryLabel(place.category)}</p>
          )}
          {place.memoContent && (
            <p className='text-brand-gray-600 text-typo-description line-clamp-2'>{place.memoContent}</p>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!placeDetail}
          className='shrink-0 flex items-center justify-center px-[8px] py-[6px] rounded-[4px] text-typo-caption whitespace-nowrap bg-brand-blue-700 text-white disabled:bg-brand-gray-200 disabled:text-brand-gray-400'
        >
          + 추가
        </button>
      </div>

      {isModalOpen && placeDetail && (
        <AddToScheduleModal
          placeDetail={placeDetail}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

interface PlanPlaceListDetailProps {
  listId: string;
  title: string;
  planId: string;
  onBack: () => void;
}

export default function PlanPlaceListDetail({ listId, title, planId, onBack }: PlanPlaceListDetailProps) {
  const { data: places } = useGetPlaceListPlaces(listId);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-row justify-between'>
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
        <p className='text-typo-sub-title font-semibold text-brand-gray-700'>{title}</p>
      </div>

      {places.length === 0 ? (
        <p className='text-typo-description text-brand-gray-400'>저장된 장소가 아직 없습니다.</p>
      ) : (
        places.map((place) => (
          <PlanPlaceItem
            key={place.id}
            place={place}
            planId={planId}
          />
        ))
      )}
    </div>
  );
}
