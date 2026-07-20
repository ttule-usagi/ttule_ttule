'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from './Icon';
import Link from 'next/link';

export default function LoginButtonProfile() {
  const [showTooltip, setShowTooltip] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='absolute bottom-5.5'>
      {/* 아바타 + 말풍선을 묶는 relative 컨테이너 */}
      <div className='relative group'>
        <div
          className={`absolute bottom-full mb-3 left-1.5 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity duration-200 ${
            !imageLoaded
              ? 'pointer-events-none opacity-0'
              : showTooltip
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
          } `}
        >
          {/* 말풍선 몸체 */}
          <div className='flex items-center gap-2 whitespace-nowrap rounded-lg bg-neon-green py-2 pl-3 pr-3'>
            <p className='text-typo-description text-brand-gray-700'>
              <span className='font-bold'>구글로그인</span>으로 간편하게
              <br />
              이용할 수 있어요!
            </p>
            <button
              type='button'
              onClick={() => setShowTooltip(false)}
              aria-label='닫기'
              className='mt-0.5 shrink-0 cursor-pointer'
            >
              <Icon
                name='XClose'
                size={26}
                className='text-brand-blue-700'
              />
            </button>
          </div>

          {/* 말풍선 꼬리 - 아바타 중앙을 향하도록 가운데 정렬 */}
          <div
            className='absolute -bottom-1.5 left-2 h-3.5 w-5 bg-neon-green'
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
          />
        </div>

        <Link
          href={'/login'}
          className='inline-block w-12 h-12 rounded-full'
        >
          <Image
            src={'/images/ellipse.png'}
            alt='placeholder-image'
            width={48}
            height={48}
            priority
            onLoad={() => setImageLoaded(true)}
            className='w-full h-full rounded-full object-cover'
          />
        </Link>
      </div>
    </div>
  );
}
