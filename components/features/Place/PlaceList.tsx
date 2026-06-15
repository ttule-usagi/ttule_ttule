'use client';

import { ListType } from '@/types/placeList';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import MoreButton from './MoreButton';
import PlaceListItem from './PlaceListItem';
import { useGetAllPlaceLists } from '@/hooks/place-list/useGetAllPlaceLists';

interface PlaceListProps {
  listType: ListType;
  emptyText: string;
}

export default function PlaceList({ listType, emptyText }: PlaceListProps) {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useGetAllPlaceLists(listType);

  if (isLoading) return <div>로딩중...</div>;
  if (isError || !data) return <ErrorState message='장소 리스트를 불러오지 못했습니다.' />;
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
