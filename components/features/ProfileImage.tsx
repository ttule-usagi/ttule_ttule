import Image from 'next/image';
import DropDown from '../common/Dropdown';
import { signOut } from 'next-auth/react';

export default function ProfileImage() {
  return (
    <DropDown>
      <DropDown.Trigger>
        <div className='w-12 h-12 rounded-full bg-brand-blue-100 box-border border border-brand-blue-700'>
          {/* <Image
        src='링크 또는 이미지 경로'
        alt='profile image'
        width={48}
        height={48}
        className='w-full h-full rounded-full object-cover'
      /> */}
        </div>
      </DropDown.Trigger>

      <DropDown.Menu>
        <DropDown.Item>내 정보 관리</DropDown.Item>
        <DropDown.Item onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</DropDown.Item>
      </DropDown.Menu>
    </DropDown>
  );
}
