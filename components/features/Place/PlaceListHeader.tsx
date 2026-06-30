'use client';

import { Icon } from '@/components/common/Icon';
import PlaceListDropdownMenu from './PlaceListDropdwonMenu';
import { useGetPlaceListDetail } from '@/hooks/place-list/useGetPlaceListDetail';

export default function PlaceListHeader({ listId }: { listId: string }) {
  const { data } = useGetPlaceListDetail(listId);

  return (
    <header className='flex flex-col gap-4'>
      <div className='flex items-start gap-3'>
        <span className='font-mona12 text-typo-big-title'>{data.icon}</span>
        <p className='font-semibold flex-1 text-typo-big-title text-brand-blue-700'>{data.title}</p>

        <div className='flex gap-3 mt-0.5'>
          <Icon
            name='Share'
            size={32}
            className='cursor-pointer'
          />
          <PlaceListDropdownMenu id={listId} />
        </div>
      </div>

      <div className='flex flex-col gap-1 text-typo-base font-light'>
        <div className='flex gap-3 text-brand-gray-400'>
          <span>{data.master.username}</span>
          {data.participantCount > 0 && <span>이미지</span>}
          <span>장소 {data.placeCount}개</span>
          <span>{data.isPublic ? '공유됨' : '비공개'}</span>
        </div>
        <p className='text-brand-gray-600'>{data.description}</p>
      </div>
    </header>
  );
}
