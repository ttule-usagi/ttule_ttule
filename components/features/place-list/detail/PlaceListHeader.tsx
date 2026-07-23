'use client';

import { Icon } from '@/components/common/Icon';
import PlaceListDropdownMenu from '../PlaceListDropdwonMenu';
import { useGetPlaceListDetail } from '@/hooks/place-list/useGetPlaceListDetail';
import { useModalStore } from '@/lib/store/modalStore';
import { createViewLink } from '@/lib/utils/invite/createViewLink';
import ParticipantsImages from './ParticipantsImages';

export default function PlaceListHeader({ listId, hasSession }: { listId: string; hasSession: boolean }) {
  const { data } = useGetPlaceListDetail(listId);
  const { open } = useModalStore();

  return (
    <header className='flex flex-col gap-4'>
      <div className='flex items-start gap-3'>
        {data.icon && <span className='font-mona12 text-typo-big-title'>{data.icon}</span>}
        <p className='font-semibold flex-1 text-typo-big-title text-brand-blue-700'>{data.title}</p>

        <div className='flex gap-3 mt-0.5'>
          <Icon
            name='Share'
            size={32}
            className='cursor-pointer'
            onClick={() =>
              open({ type: 'shareLink', props: { type: 'VIEW', link: createViewLink(listId, 'place_list') } })
            }
          />
          {hasSession && (
            <PlaceListDropdownMenu
              id={listId}
              type='detail'
              listName={data.title}
              myRole={data.myRole}
            />
          )}
        </div>
      </div>

      <div className='flex flex-col gap-1 text-typo-base font-light'>
        <div className='flex gap-2 text-brand-gray-400 items-center'>
          <span>{data.master.username}</span>
          {data.participantCount > 0 && (
            <ParticipantsImages
              data={data.participants}
              participantCount={data.participantCount}
            />
          )}
          <span>장소 {data.placeCount}개</span>
          <span>{data.isPublic ? '공유됨' : '비공개'}</span>
        </div>
        <p className='text-brand-gray-600'>{data.description}</p>
      </div>
    </header>
  );
}
