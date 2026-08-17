'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useShareEditLink } from '@/hooks/invite-member/useShareEditLink';
import { useConfirmDeletePlaceList } from '@/hooks/place-list/useConfirmDeletePlaceList';
import { useModalStore } from '@/lib/store/modalStore';
import { createViewLink } from '@/lib/utils/invite/createViewLink';
import { Role } from '@/types/shareOption';

import AuthorityWrapper from '../AuthorityWrapper';

import PlaceListShareOptionModal from './PlaceListShareOptionModal';

interface PlaceListDropdownMenuProps {
  id: string;
  type?: 'overview' | 'detail';
  listName: string;
  myRole: Role | null;
}

export default function PlaceListDropdownMenu({ id, type = 'overview', listName, myRole }: PlaceListDropdownMenuProps) {
  const router = useRouter();
  const { open } = useModalStore();
  const { createShareLink, isPending } = useShareEditLink();
  const { confirmDeletePlaceList } = useConfirmDeletePlaceList();

  const [isShareOptionModalOpen, setShareOptionModalOpen] = useState(false);

  const isMaster = myRole === 'master';

  return (
    <AuthorityWrapper
      role={myRole}
      requiredRole='editor'
    >
      <DropDown>
        <DropDown.Trigger>
          <Icon
            name='DotsHorizontal'
            size={32}
            className={`cursor-pointer rounded-sm text-brand-blue-700 hover:text-brand-blue-800 ${type === 'overview' ? 'hover:bg-brand-gray-100' : 'hover:bg-black/5'}`}
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
            <DropDown.Item onClick={() => router.push(`/places/${id}/edit`)}>리스트 편집</DropDown.Item>
          )}
          {isMaster && (
            <DropDown.Item onClick={() => confirmDeletePlaceList(listName, id, type === 'detail')}>
              리스트 삭제
            </DropDown.Item>
          )}
        </DropDown.Menu>
      </DropDown>

      {isShareOptionModalOpen && (
        <PlaceListShareOptionModal
          id={id}
          onClose={() => setShareOptionModalOpen(false)}
        />
      )}
    </AuthorityWrapper>
  );
}
