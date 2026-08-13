'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import DropDown from '@/components/common/Dropdown';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import ProfileImage from '@/components/features/ProfileImage';

export default function SidebarProfile() {
  const router = useRouter();
  return (
    <div className='absolute bottom-5.5'>
      <DropDown>
        <DropDown.Trigger>
          <QueryBoundary
            errorFallback={() => (
              <div className='inline-block w-12 h-12 rounded-full'>
                <Image
                  src={'/images/profile-blank-tomato.webp'}
                  alt='placeholder-image'
                  width={48}
                  height={48}
                  className='w-full h-full rounded-full object-cover'
                />
              </div>
            )}
          >
            <ProfileImage />
          </QueryBoundary>
        </DropDown.Trigger>
        <DropDown.Menu>
          <DropDown.Item onClick={() => router.push('/mypage')}>내 정보 관리</DropDown.Item>
          <DropDown.Item onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
