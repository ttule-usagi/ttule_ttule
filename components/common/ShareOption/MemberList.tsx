'use client';

import { Member } from '@/types/shareOption';

import { Icon } from '../Icon';

import { MemberAvatar } from './MemberAvatar';

interface MemberListProps {
  members: Member[];
  onRemove: (targetUserId: string) => void;
  onInvite: () => void;
  isMaster: boolean;
}

export function MemberList({ members, onRemove, onInvite, isMaster }: MemberListProps) {
  const master = members.find((m) => m.role === 'master');
  const editors = members.filter((m) => m.role !== 'master');

  return (
    <div className='flex flex-col gap-3'>
      {/* 섹션 헤더 */}
      <div className='flex items-center justify-between'>
        <span className='text-typo-base font-light text-brand-gray-600'>수정할 수 있는 사람</span>
        <button
          onClick={onInvite}
          className='text-typo-base text-brand-blue-700 cursor-pointer p-1 hover:text-brand-blue-800 rounded-sm hover:bg-brand-gray-100'
        >
          초대하기
        </button>
      </div>

      {/* 멤버 목록 */}
      <div className='flex flex-col gap-2'>
        {/* 소유자 */}
        {master && (
          <div className='rounded-lg bg-brand-gray-100 p-3 max-h-16.5'>
            <div className='flex items-center gap-2.5'>
              <MemberAvatar
                name={master.username}
                profileImage={master.profileImageUrl}
              />
              <div className='flex flex-col'>
                <span className='text-typo-base text-brand-gray-700'>{master.username}</span>
                <span className='text-typo-description text-brand-gray-700 font-light'>소유자</span>
              </div>
            </div>
          </div>
        )}

        {/* 편집자들 */}
        {editors.map((member) => (
          <div
            key={member.id}
            className='flex items-center rounded-lg bg-brand-gray-100 p-3 min-h-16.5'
          >
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <MemberAvatar
                  name={member.username}
                  profileImage={member.profileImageUrl}
                />
                <span className='text-typo-base text-brand-gray-700'>{member.username}</span>
              </div>
              {isMaster && (
                <button
                  onClick={() => onRemove(member.id)}
                  className='flex h-6 w-6 items-center justify-center rounded-full text-brand-gray-700 cursor-pointer hover:bg-brand-gray-200 hover:text-brand-blue-800'
                >
                  <Icon
                    name='XClose'
                    size={24}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
