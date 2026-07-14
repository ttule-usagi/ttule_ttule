'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { PlanPlaceListSection } from './PlanPlaceListSection';
import dynamic from 'next/dynamic';

interface PlanPlaceListContainerProps {
  planId: string;
  scheduleId: string;
}

export default function PlanPlaceListContainer({ planId, scheduleId }: PlanPlaceListContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const PlanPlaceListSection = dynamic(
    () => import('./PlanPlaceListSection').then((mod) => ({ default: mod.PlanPlaceListSection })),
    { ssr: false },
  );

  return (
    <>
      {/* 슬라이드 패널 */}
      <section
        className={`fixed top-0 h-screen w-102 pt-23.5 px-4 pb-7 overflow-y-auto bg-line-pattern z-10 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <PlanPlaceListSection
          planId={planId}
          scheduleId={scheduleId}
        />
      </section>

      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-[20px] h-[48px] bg-white rounded-r-[8px] shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'left-102' : 'left-0'
        }`}
      >
        <Icon
          name={isOpen ? 'ChevronLeft' : 'ChevronRight'}
          size={16}
          className='text-brand-gray-600'
        />
      </button>
    </>
  );
}
