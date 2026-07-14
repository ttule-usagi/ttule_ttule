'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import dynamic from 'next/dynamic';

interface PlanPlaceListContainerProps {
  planId: string;
}

const PlanPlaceListSection = dynamic(
  () => import('./PlanPlaceListSection').then((mod) => ({ default: mod.PlanPlaceListSection })),
  {
    ssr: false,
    loading: () => null, // ← 로딩 중 아무것도 표시 안 함
  },
);

export default function PlanPlaceListContainer({ planId }: PlanPlaceListContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 슬라이드 패널 */}
      <section
        className={`fixed top-0 h-screen w-102 pt-23.5 px-4 pb-7 overflow-y-auto bg-line-pattern z-10 transition-transform duration-300 ease-in-out border-r border-brand-blue-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <PlanPlaceListSection planId={planId} />
      </section>

      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-13 bg-brand-blue-700 rounded-r-[8px] shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'left-101 w-8' : 'left-0 w-18'
        }`}
      >
        {isOpen ? (
          ''
        ) : (
          <Icon
            name='Bookmark'
            size={30}
            className='text-white ml-3'
          />
        )}
        <Icon
          name={isOpen ? 'ChevronLeft' : 'ChevronRight'}
          size={40}
          className='text-white'
        />
      </button>
    </>
  );
}
