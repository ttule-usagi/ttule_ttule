'use client';

import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListDetail';
import PlaceItem from './PlaceItem';
import EmptyState from './EmptyState';

export default function PlaceListPlaces({ listId }: { listId: string }) {
  const { data } = useGetPlaceListPlaces(listId);

  if (data.length === 0) return <EmptyState message='저장된 장소가 아직 없습니다.' />;

  return (
    <>
      {data.map((item) => (
        <PlaceItem
          key={item.id}
          place={item}
        />
      ))}
    </>
  );
}
