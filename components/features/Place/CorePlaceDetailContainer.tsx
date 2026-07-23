'use client';

import { useState } from 'react';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';
import CorePlaceDetail from '@/components/features/place/CorePlaceDetail';
import SaveToListModal from '@/components/features/place/save/ListModal';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import AddToScheduleModal from '@/components/features/place/save/ScheduleModal';

export default function CorePlaceDetailContainer({ placeId }: { placeId: string }) {
  const { data } = useGetCorePlace(placeId);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <>
      <CorePlaceDetail
        data={data}
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
