'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
      className='modal-overlay bg-white md:bg-black/50'
      onClick={onClose}
    >
      <div className='relative w-full h-screen md:w-auto md:h-auto md:px-14 flex flex-col'>
        <h3 className='absolute hidden md:block -top-10 text-typo-sub-title text-white '>뚤레뚤레 소개</h3>
        {/* 이전 화살표 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className='absolute hidden md:block left-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-center'
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
          className='bg-white rounded-sm w-full md:w-95 min-h-100 md:h-150 md:max-h-[75vh] flex flex-col items-center gap-4 p-5 pt-4 overflow-x-visible flex-grow md:flex-grow-0 '
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
            className='absolute hidden md:block right-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-center z-999'
            aria-label='다음'
          >
            <Icon
              name='ChevronRight'
              size={56}
              className='text-white hover:text-neon-hover'
            />
          </button>
        )}
        <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 hidden md:flex'>
          {InfoSteps.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i === currentIndex ? 'bg-brand-blue-400' : 'bg-brand-gray-200'}`}
            />
          ))}
        </div>

        {/* 모바일 푸터 */}
        <div className='md:hidden flex flex-row justify-between items-center px-5 pb-5 w-full'>
          <div className='flex gap-1.5 px-4 py-3 bg-brand-gray-100 rounded-full'>
            {InfoSteps.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full ${i === currentIndex ? 'bg-brand-blue-400' : 'bg-brand-gray-300'}`}
              />
            ))}
          </div>
          <div className='flex items-center'>
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className='z-10 size-7.5 flex items-center justify-center'
                aria-label='이전 페이지'
              >
                <Icon
                  name='ChevronLeft'
                  size={56}
                  className='text-brand-gray-500 hover:text-brand-blue-700'
                />
              </button>
            )}
            {currentIndex < total - 1 && (
              <button
                onClick={handleNext}
                className='z-10 size-7.5 flex items-center justify-center'
                aria-label='다음'
              >
                <Icon
                  name='ChevronRight'
                  size={56}
                  className='text-brand-gray-500 hover:text-brand-blue-700'
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
