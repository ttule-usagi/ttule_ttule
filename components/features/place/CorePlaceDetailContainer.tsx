'use client';

import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import CorePlaceDetail from '@/components/features/place/CorePlaceDetail';
import SaveToListModal from '@/components/features/place/save/ListModal';
import AddToScheduleModal from '@/components/features/place/save/ScheduleModal';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';

/**
 * 장소 상세 컨테이너
 * @param placeId - CorePlaceId 전달
 * @param onClose - 모달로 사용하는 경우 필요
 * @param isPadding - 모달로 사용하는 경우 false 값 전달
 */
export default function CorePlaceDetailContainer({
  placeId,
  onClose,
  isPadding = true,
}: {
  placeId: string;
  onClose?: () => void;
  isPadding?: boolean;
}) {
  const { data } = useGetCorePlace(placeId);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col relative min-h-0 h-full w-full bg-white'>
        {/* 닫기 버튼 */}
        {onClose && (
          <div className='absolute right-4 top-4 z-20 h-0'>
            <button
              onClick={onClose}
              className='bg-white rounded-full size-8 flex items-center justify-center cursor-pointer hover:bg-brand-gray-100'
              aria-label='닫기'
            >
              <Icon
                name='XClose'
                size={24}
                className='text-brand-gray-600 hover:text-brand-blue-700'
              />
            </button>
          </div>
        )}

        <div className={`flex-1 min-h-0 overflow-y-auto ${isPadding ? 'px-4' : ''}`}>
          <CorePlaceDetail
            data={data}
            onSave={() => setIsSaveModalOpen(true)}
            onAddToSchedule={() => setIsScheduleModalOpen(true)}
          />
        </div>
      </div>

      {isSaveModalOpen && (
        <QueryBoundary>
          <SaveToListModal
            placeDetail={data}
            onClose={() => setIsSaveModalOpen(false)}
          />
        </QueryBoundary>
      )}
      {isScheduleModalOpen && (
        <AddToScheduleModal
          placeDetail={data}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </>
  );
}
