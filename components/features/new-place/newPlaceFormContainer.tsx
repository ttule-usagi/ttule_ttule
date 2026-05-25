'use client';

import { Icon } from '@/components/common/Icon';
import { useState } from 'react';

export default function NewPlaceFormContainer() {
  const [tab, setTab] = useState('basic');
  return (
    <>
      <div className='fixed flex justify-center top-0 left-0 bg-[#424a602b] w-full h-full pt-[76px] px-4 z-[100]'>
        <div
          className='relative h-min rounded-lg bg-white z-40 w-[clamp(340px,40vw,560px)] px-6 py-7 top-0
      '
        >
          <div className='flex justify-between '>
            <h3 className='text-typo-title text-brand-blue-800'>장소 추가</h3>
            <Icon
              name='XClose'
              size={32}
              className='text-brand-gray-500'
            />
          </div>

          <div className='mt-6 flex gap-4 items-start text-typo-base text-brand-gray-500'>
            <button
              onClick={() => setTab('basic')}
              className={tab === 'basic' ? 'text-brand-blue-700 border-b-2 border-brand-blue-700 pb-2' : ''}
            >
              기본 정보
            </button>
            <button
              onClick={() => setTab('detail')}
              className={tab === 'detail' ? 'text-brand-blue-700  border-b-2 border-brand-blue-700 pb-2' : ''}
            >
              세부 정보
            </button>
          </div>

          <div className='mt-6 h-142'></div>
          <div className='absolute w-full rounded-b-lg bottom-0 right-0 px-6 py-5'>
            <button>저장하기</button>
          </div>
        </div>
      </div>
    </>
  );
}
