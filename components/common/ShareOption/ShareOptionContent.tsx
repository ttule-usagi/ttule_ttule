'use client';

import { useSession } from 'next-auth/react';

import { useShareEditLink } from '@/hooks/invite-member/useShareEditLink';
import { useConfirmDeleteMember } from '@/hooks/shareOption/useConfirmDeleteMember';
import { useGetMembers } from '@/hooks/shareOption/useGetMembers';
import { useModalStore } from '@/lib/store/modalStore';
import { createViewLink } from '@/lib/utils/invite/createViewLink';
import { ResourceParams } from '@/types/shareOption';

import { Icon } from '../Icon';

import { MemberList } from './MemberList';
import { PublicStateSelector } from './PublicStateSelector';

export default function ShareOptionContent({ id, resourceType, padding }: ResourceParams & { padding?: string }) {
  const { open } = useModalStore();
  const { createShareLink, isPending } = useShareEditLink();
  const { data: members } = useGetMembers({ id, resourceType });
  const { confirmDeleteMember } = useConfirmDeleteMember({ id, resourceType });
  const { data: session } = useSession();

  // 역할 판단
  const myRole = members.find((data) => data.id === session?.user.id)?.role;
  const isMaster = myRole === 'master';

  return (
    <div className={`w-full flex flex-col gap-10 flex-1 min-h-0 overflow-y-auto ${padding ? padding : ''}`}>
      {/* 수정 권한 초대 버튼 */}
      <div className='flex flex-col gap-3'>
        <span className='text-typo-base font-light text-brand-gray-600'>공유 링크</span>
        <button
          className='flex items-center gap-2 rounded-sm border border-brand-gray-300 px-4 py-1.5 max-w-60.75 hover:bg-brand-gray-50 cursor-pointer'
          disabled={isPending}
          onClick={() => createShareLink(id, resourceType)}
        >
          <Icon
            name='UserPlus'
            size={24}
            className='text-brand-blue-700'
          />
          <span className='text-typo-base text-brand-blue-700'>수정 권한이 있는 사용자 초대</span>
        </button>
      </div>

      {/* 공개/비공개 설정 버튼 */}
      <div className='flex flex-col gap-3'>
        <span className='text-typo-base font-light text-brand-gray-600'>공개 여부</span>
        <PublicStateSelector
          id={id}
          resourceType={resourceType}
          disabled={!isMaster}
        />
        {/* 보기 링크 공유 버튼 */}
        <button
          className='flex self-start items-center justify-center gap-2 rounded-sm border border-brand-gray-300 px-4 py-1.5 w-fit hover:bg-brand-gray-50 cursor-pointer'
          onClick={() => {
            open({ type: 'shareLink', props: { type: 'VIEW', link: createViewLink(id, resourceType) } });
          }}
        >
          <Icon
            name='LinkThin'
            size={24}
            className='text-brand-blue-700'
          />
          <span className='text-typo-base text-brand-blue-700'>{`${resourceType === 'plan' ? '계획을' : '리스트를'} 보기 위한 링크 복사하기`}</span>
        </button>
      </div>

      {/* 참여 유저 목록 */}
      <MemberList
        members={members}
        onRemove={confirmDeleteMember}
        onInvite={() => createShareLink(id, resourceType)}
        isMaster={isMaster}
      />
    </div>
  );
}
