'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import DropDown from '@/components/common/Dropdown';
import ProfileImage from '@/components/features/ProfileImage';

export default function SidebarProfile() {
  const router = useRouter();
  return (
    <div className='absolute bottom-5.5'>
      <DropDown>
        <DropDown.Trigger>
          <ProfileImage />
        </DropDown.Trigger>
        <DropDown.Menu>
          <DropDown.Item onClick={() => router.push('/mypage')}>내 정보 관리</DropDown.Item>
          <DropDown.Item onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
