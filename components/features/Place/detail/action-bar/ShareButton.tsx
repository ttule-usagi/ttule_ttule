import { useState } from 'react';

import { Icon } from '@/components/common/Icon';

export default function ShareButton() {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleCopyPlaceLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);

      // 툴팁 설정
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    } catch (error) {
      console.error('복사 실패: ', error);
    }
  };

  return (
    <div className='relative w-fit flex flex-col items-center'>
      <div
        className={`absolute bottom-full mb-2.5 z-10 transition-opacity duration-300 ease-in-out ${
          showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={showTooltip ? 'animate-bounce' : ''}>
          <div className='relative group'>
            {/* 말풍선 몸체 */}
            <div className='flex items-center gap-2 whitespace-nowrap rounded-lg bg-black/40 py-1 px-1.5'>
              <p className='text-typo-caption text-brand-gray-50'>복사 완료!</p>
            </div>

            {/* 말풍선 꼬리 - 아바타 중앙을 향하도록 가운데 정렬 */}
            <div
              className='absolute left-1/2 -translate-x-1/2 h-1.5 w-5 bg-black/40'
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 50% 100%)' }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCopyPlaceLink}
        className='flex items-center justify-center p-2 border border-brand-gray-200 rounded-lg bg-white cursor-pointer'
        aria-label='공유'
      >
        <Icon
          name={showTooltip ? 'Check' : 'Share'}
          size={24}
        />
      </button>
    </div>
  );
}
