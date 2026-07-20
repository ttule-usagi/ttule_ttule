'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useShareEditLink } from '@/hooks/invite-member/useShareEditLink';
import { useModalStore } from '@/lib/store/modalStore';
import { createViewLink } from '@/lib/utils/invite/createViewLink';
import { useState } from 'react';
import PlaceListShareOptionModal from './PlaceListShareOptionModal';

interface PlaceListDropdownMenuProps {
  id: string;
  type?: 'overview' | 'detail';
}

export default function PlaceListDropdownMenu({ id, type = 'overview' }: PlaceListDropdownMenuProps) {
  const { open } = useModalStore();
  const { createShareLink, isPending } = useShareEditLink();

  const [isShareOptionModalOpen, setShareOptionModalOpen] = useState(false);

  return (
    <>
      <DropDown>
        <DropDown.Trigger>
          <Icon
            name='DotsHorizontal'
            size={32}
            className='cursor-pointer text-brand-blue-700'
          />
        </DropDown.Trigger>

        <DropDown.Menu>
          <DropDown.Item
            onClick={() => {
              open({ type: 'shareLink', props: { type: 'VIEW', link: createViewLink(id, 'place_list') } });
            }}
          >
            리스트를 보기 위한 링크 보내기
          </DropDown.Item>
          <DropDown.Item
            disabled={isPending}
            onClick={() => createShareLink(id, 'place_list')}
          >
            수정할 수 있도록 초대
          </DropDown.Item>
          <DropDown.Item onClick={() => setShareOptionModalOpen(true)}>공유 옵션 관리</DropDown.Item>
          {type === 'detail' && (
            <DropDown.Item onClick={() => console.log('전체 리스트 편집 페이지로 이동')}>리스트 편집</DropDown.Item>
          )}
          <DropDown.Item>리스트 삭제</DropDown.Item>
        </DropDown.Menu>
      </DropDown>

      {isShareOptionModalOpen && (
        <PlaceListShareOptionModal
          id={id}
          onClose={() => setShareOptionModalOpen(false)}
        />
      )}
    </>
  );
}
