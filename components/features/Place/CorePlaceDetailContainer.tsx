'use client';

import { useState } from 'react';
import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';
import CorePlaceDetail from '@/components/features/Place/CorePlaceDetail';
import SaveToListModal from '@/components/features/Place/SaveToListModal';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';

export default function CorePlaceDetailContainer({ placeId }: { placeId: string }) {
  const { data } = useGetCorePlace(placeId);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return (
    <>
      <CorePlaceDetail
        data={data}
        onSave={() => setIsSaveModalOpen(true)}
      />
      {isSaveModalOpen && (
        <QueryBoundary>
          <SaveToListModal
            placeDetail={data}
            onClose={() => setIsSaveModalOpen(false)}
          />
        </QueryBoundary>
      )}
    </>
  );
}
