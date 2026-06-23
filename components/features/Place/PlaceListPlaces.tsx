'use client';

import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListDetail';
import PlaceItem from './PlaceItem';

export default function PlaceListPlaces({ listId }: { listId: string }) {
  const { data } = useGetPlaceListPlaces(listId);

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
