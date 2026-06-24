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
  const { data, fetchNextPage, hasNextPage, isFetchNextPageError } = useGetAllPlaceLists(listType);

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
      {isFetchNextPageError && (
        <div className='w-full text-center py-7 text-tag-red-text text-typo-base'>
          추가 로딩 중 에러가 발생했습니다. <br />
          잠시 후 다시 시도해주세요.
        </div>
      )}
      {hasNextPage && <MoreButton onClick={fetchNextPage} />}
    </div>
  );
}
