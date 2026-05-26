'use client';

import { Icon } from '@/components/common/Icon';
import { Place } from '@/types/placeList';
import Image from 'next/image';
import React, { useState } from 'react';

export default function PlaceItem({ place }: { place: Place }) {
  const [isEdit, setIsEdit] = useState(false);
  const [memo, setMemo] = useState<string | null>(place.memoContent);

  const handleEdit = (e: React.SubmitEvent) => {
    e.preventDefault();

    // 수정 api 호출
  };

  return (
    <div className='w-full flex gap-3.25 bg-brand-gray-0 p-3 rounded-sm border border-brand-blue-700 items-start'>
      {!isEdit && (
        <div className='w-20 h-20 shrink-0 border border-brand-blue-700 rounded-xs'>
          {place.thumbnail ? (
            <Image
              src={place.thumbnail}
              alt='thumbnail'
            />
          ) : (
            <div>이미지</div>
          )}
        </div>
      )}

      <div className='flex flex-col gap-1 flex-1'>
        <div className='flex justify-between items-center'>
          <p className='flex-1 text-typo-sub-title'>{place.customName}</p>
          {!isEdit ? (
            <Icon
              name='Edit'
              size={26}
              className='text-brand-gray-300 cursor-pointer'
              onClick={() => setIsEdit(!isEdit)}
            />
          ) : (
            <Icon
              name='XClose'
              size={26}
              className='text-brand-gray-300 cursor-pointer'
              onClick={() => setIsEdit(!isEdit)}
            />
          )}
        </div>

        {!isEdit && <p className='text-brand-gray-400 text-typo-description'>{place.category}</p>}
        {!isEdit ? (
          <p className='text-brand-gray-600 text-typo-description'>{place.memoContent}</p>
        ) : (
          <form>
            <textarea
              value={memo ?? ''}
              className='bg-brand-gray-100 min-h-16 text-typo-base px-3 py-2 text-brand-gray-600 border border-brand-gray-200 outline-none resize-none rounded-sm w-full'
              onChange={(e) => setMemo(e.target.value)}
            />

            <div className='text-typo-base flex gap-4 font-light'>
              <button
                className='w-16 text-brand-gray-500 cursor-pointer'
                onClick={() => setIsEdit(!isEdit)}
              >
                취소
              </button>
              <button
                type='submit'
                className='flex-1 bg-brand-blue-700 text-brand-gray-0 rounded-sm py-2 cursor-pointer'
              >
                저장하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
