'use client';

import { useState } from 'react';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import CorePlaceDetail from '@/components/features/place/CorePlaceDetail';
import SaveToListModal from '@/components/features/place/save/ListModal';
import AddToScheduleModal from '@/components/features/place/save/ScheduleModal';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';

export default function CorePlaceDetailContainer({ placeId, onClose }: { placeId: string; onClose?: () => void }) {
  const { data } = useGetCorePlace(placeId);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <>
      <CorePlaceDetail
        data={data}
        onClose={onClose}
        onSave={() => setIsSaveModalOpen(true)}
        onAddToSchedule={() => setIsScheduleModalOpen(true)}
      />
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
