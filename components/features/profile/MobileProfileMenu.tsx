'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import LoginButtonProfile from '@/components/common/LoginButtonProfile';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useGetUserInfo } from '@/hooks/user/useGetUserInfo';

import MobileProfileImg from './MobileProfileImg';

interface MoblieProfileMenuProps {
  onClose: () => void;
}

export default function MobileProfileMenu({ onClose }: MoblieProfileMenuProps) {
  const { status } = useSession();
  const { data: user } = useGetUserInfo();

  return createPortal(
    <div className='fixed inset-0 flex-col backdrop-blur-sm bg-white/80 overflow-y-auto md:hidden z-1000 text-typo-base text-brand-gray-600'>
      <div className='flex flex-1 flex-row justify-between items-center px-4 py-3 border-b border-brand-gray-200'>
        <div className='flex flex-row items-center gap-4 text-typo-base text-brand-gray-600'>
          {status === 'authenticated' && (
            <QueryBoundary subject='프로필'>
              <MobileProfileImg />
            </QueryBoundary>
          )}
          {status === 'unauthenticated' && <LoginButtonProfile />}
          <p>{user.username}</p>
        </div>
        <button
          type='button'
          aria-label='창 닫기'
          onClick={onClose}
          className='cursor-pointer'
        >
          <Icon
            name='XClose'
            size={32}
            className='text-brand-gray-500'
          />
        </button>
      </div>

      <ul className='py-8 px-4 border-b border-brand-gray-200 hover:text-brand-gray-600'>
        <li className='mb-9'>
          <Link href={'/lobby'}>로비 (여행)</Link>
        </li>
        <li>
          <Link href={'/places'}>장소 리스트</Link>
        </li>
      </ul>

      <ul className='py-8 px-4 border-b border-brand-gray-200 hover:text-brand-gray-600'>
        <li className='mb-9'>
          <Link href={'/mypage'}>내 정보 관리</Link>
        </li>
        <li>
          <button
            className='cursor-pointer'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            로그아웃
          </button>
        </li>
      </ul>
    </div>,
    document.body,
  );
}
