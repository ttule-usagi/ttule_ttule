'use client';

import Image from 'next/image';
import { useState } from 'react';

import AddToScheduleModal from '@/components/features/place/save/ScheduleModal';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { Place } from '@/types/placeList';

interface PlanPlaceItemProps {
  place: Place;
}

export default function PlanPlaceItem({ place }: PlanPlaceItemProps) {
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
          className='shrink-0 flex items-center justify-center px-2 py-1.5 rounded-sm text-typo-caption whitespace-nowrap bg-brand-blue-700 text-white disabled:bg-brand-gray-200 disabled:text-brand-gray-400'
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
