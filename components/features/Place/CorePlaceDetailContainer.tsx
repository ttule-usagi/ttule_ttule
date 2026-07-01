'use client';

import { useGetCorePlace } from '@/hooks/place/useGetCorePlace';
import CorePlaceDetail from '@/components/features/Place/CorePlaceDetail';

export default function CorePlaceDetailContainer({ placeId }: { placeId: string }) {
  const { data } = useGetCorePlace(placeId);
  console.log('CorePlaceDetailContainer data:', data);

  return <CorePlaceDetail data={data} />;
}