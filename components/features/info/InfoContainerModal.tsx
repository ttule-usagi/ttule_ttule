'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import ModalHeader from '@/components/features/place/save/modal-item/ModalHeader';
import { useIsMounted } from '@/hooks/useIsMounted';

import { InfoSteps } from './InfoSteps';

interface InfoModalProps {
  onClose: () => void;
}
export default function InfoContainerModal({ onClose }: InfoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = InfoSteps.length;
  const current = InfoSteps[currentIndex];

  const isMounted = useIsMounted();
  if (!isMounted) return null;

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  };
  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return createPortal(
    <div
      className='modal-overlay'
      onClick={onClose}
    >
      <div className='relative px-14'>
        <h3 className='absolute -top-10 text-typo-sub-title text-white'>뚤레뚤레 소개</h3>
        {/* 이전 화살표 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-center'
            aria-label='이전 페이지'
          >
            <Icon
              name='ChevronLeft'
              size={56}
              className='text-white hover:text-neon-hover'
            />
          </button>
        )}
        <div
          className='bg-white rounded-sm w-95 min-h-100 h-150 max-h-[75vh] flex flex-col items-center gap-4 p-5 pt-4 overflow-x-visible'
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            title={current.title}
            onClose={onClose}
          />

          {current.content}
        </div>
        {currentIndex < total - 1 && (
          <button
            onClick={handleNext}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-center z-999'
            aria-label='다음'
          >
            <Icon
              name='ChevronRight'
              size={56}
              className='text-white hover:text-neon-hover'
            />
          </button>
        )}
        <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5'>
          {InfoSteps.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i === currentIndex ? 'bg-brand-blue-400' : 'bg-brand-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
