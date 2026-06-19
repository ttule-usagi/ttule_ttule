'use client';

import { ListType } from '@/types/placeList';
import EmptyState from './EmptyState';
import MoreButton from './MoreButton';
import PlaceListItem from './PlaceListItem';
import { useGetAllPlaceLists } from '@/hooks/place-list/useGetAllPlaceLists';

interface PlaceListProps {
  listType: ListType;
  emptyText: string;
}

export default function PlaceList({ listType, emptyText }: PlaceListProps) {
  const { data, fetchNextPage, hasNextPage } = useGetAllPlaceLists(listType);

  if (data?.items.length === 0) return <EmptyState message={emptyText} />;

  return (
    <div className='flex flex-col gap-4 items-center w-full'>
      <div className='flex flex-col gap-3 items-center w-full'>
        {data.items.map((item) => (
          <PlaceListItem
            key={item.id}
            place={item}
          />
        ))}
      </div>
      {hasNextPage && <MoreButton onClick={fetchNextPage} />}
    </div>
  );
}
