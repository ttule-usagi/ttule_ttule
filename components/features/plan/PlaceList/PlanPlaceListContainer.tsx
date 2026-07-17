'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/common/Icon';
import dynamic from 'next/dynamic';
import { usePlanPlaceListStore } from '@/lib/store/planPlaceListStore';

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
  const { shouldOpenPlaceList, resetOpenPlaceList } = usePlanPlaceListStore();

  useEffect(() => {
    if (shouldOpenPlaceList) {
      setIsOpen(true);
      resetOpenPlaceList();
    }
  }, [shouldOpenPlaceList]);

  return (
    <>
      <div
        className={`fixed top-0 h-screen z-10 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='relative h-full max-w-102 min-w-85 w-[26vw]'>
          {/* 패널 */}
          <section className='h-full pt-23.5 px-4 pb-7 overflow-y-auto bg-line-pattern border-r border-brand-blue-700'>
            <PlanPlaceListSection planId={planId} />
          </section>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className='absolute top-1/2 -translate-y-1/2 left-full flex items-center justify-center h-13 bg-brand-blue-700 rounded-r-[8px] shadow-lg'
          >
            {!isOpen && (
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
        </div>
      </div>
    </>
  );
}
