'use client';

import DropDown from '@/components/common/Dropdown';
import ProfileImage from '@/components/features/ProfileImage';
import { signOut } from 'next-auth/react';

export default function SidebarProfile() {
  return (
    <div className='absolute bottom-5.5'>
      <DropDown>
        <DropDown.Trigger>
          <ProfileImage />
        </DropDown.Trigger>
        <DropDown.Menu>
          <DropDown.Item>내 정보 관리</DropDown.Item>
          <DropDown.Item onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
