'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import MobileProfileMenu from '../features/profile/MobileProfileMenu';
import CorePlaceSearchInput from '../features/search/CorePlaceSearchInput';

import { Icon } from './Icon';

export default function SearchSection() {
  const pathname = usePathname();
  const [isProfilePageOpen, setIsProfilePageOpen] = useState(false);

  const urls = [
    { name: 'lobby', href: '/lobby' },
    { name: 'places', href: '/places' },
  ];

  // 배열 내 href 중 하나라도 pathname에 매칭되는지 검사
  const shouldShowButton = urls.some((url) => pathname.startsWith(url.href));

  const setClose = () => setIsProfilePageOpen(false);

  return (
    <div className='z-20 md:px-4 pt-5 md:mb-8 flex-none flex flex-row items-center justify-center gap-3'>
      <button
        type='button'
        aria-label='메뉴 열기'
        className={`text-brand-blue-700 cursor-pointer ${shouldShowButton ? 'block' : 'hidden'}`}
        onClick={() => setIsProfilePageOpen(true)}
      >
        <Icon
          name='Hamburger'
          size={32}
        />
      </button>
      <CorePlaceSearchInput />
      {isProfilePageOpen && (
        <div className='flex'>
          <MobileProfileMenu onClose={setClose} />
        </div>
      )}
    </div>
  );
}
