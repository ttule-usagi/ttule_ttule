'use client';

import PlaceItem from './PlaceItem';
import EmptyState from '../../../common/EmptyState';
import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListPlaces';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function PlaceListPlaces({ listId }: { listId: string }) {
  const { data } = useGetPlaceListPlaces(listId);
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort') || 'updated';

  const sortedPlaces = useMemo(() => {
    return data.sort((a, b) => {
      // 최근 수정순
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      // 최근 등록순
      if (sortBy === 'createdDesc') {
        return new Date(b.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // 과거 등록순
      if (sortBy === 'createdAsc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }, [data, sortBy]);

  if (data.length === 0) return <EmptyState message='저장된 장소가 아직 없습니다.' />;

  return (
    <>
      {sortedPlaces.map((item) => (
        <PlaceItem
          key={item.id}
          place={item}
          listId={listId}
        />
      ))}
    </>
  );
}
