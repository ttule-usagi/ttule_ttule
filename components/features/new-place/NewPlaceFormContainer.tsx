'use client';

import { Icon } from '@/components/common/Icon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewPlaceForm } from '@/hooks/useNewPlaceForm';
import FormBasicKorean from './FormBasicKorean';
import FormBasicGlobal from './FormBasicGlobal';
import FormDetail from './FormDetail';
import type { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import { deleteImage } from '@/lib/actions/storage';

interface Props {
  place: SelectedGooglePlace;
  onClose: () => void;
}

export default function NewPlaceFormContainer({ place, onClose }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState('basic');

  const { state, dispatch, isKorean, handleSubmit, isPending, error } = useNewPlaceForm(place, {
    onSuccess: (placeId) => {
      onClose();
      router.push(`/places/${placeId}`);
    },
  });

  const handleClose = () => {
    if (state.imageUrl) {
      deleteImage(state.imageUrl);
    }
    onClose();
  };

  return (
    <>
      <div className='fixed flex justify-center top-0 left-0 bg-[#424a602b] w-full h-full pt-[76px] px-4 z-[100]'>
        <div
          className='relative max-h-184 rounded-lg bg-white z-40 w-[clamp(340px,52vw,560px)] px-6 py-7 top-0
      '
        >
          <div className='flex justify-between '>
            <h3 className='text-typo-title text-brand-blue-800'>장소 추가</h3>
            <button
              type='button'
              onClick={handleClose}
              aria-label='닫기'
            >
              <Icon
                name='XClose'
                size={32}
                className='text-brand-gray-500'
              />
            </button>
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
          <form onSubmit={handleSubmit}>
            {' '}
            <div className={tab === 'basic' ? '' : 'hidden'}>
              {isKorean ? (
                <FormBasicKorean
                  state={state}
                  dispatch={dispatch}
                  place={place}
                />
              ) : (
                <FormBasicGlobal
                  state={state}
                  dispatch={dispatch}
                  place={place}
                />
              )}
            </div>
            <div className={tab === 'detail' ? '' : 'hidden'}>
              <FormDetail
                state={state}
                dispatch={dispatch}
              />
            </div>
            <div className='absolute w-full rounded-b-lg bottom-0 right-0 px-6 py-5 bg-brand-gray-200'>
              {error && (
                <p
                  role='alert'
                  className='text-red-500 text-typo-description'
                >
                  {error}
                </p>
              )}

              <button
                className='float-right py-3 px-9 typo-text-base-bold text-white bg-brand-blue-700 rounded-sm hover:bg-brand-blue-800 cursor-pointer'
                type='submit'
                disabled={isPending}
              >
                {isPending ? '등록 중...' : '등록하기'}
              </button>
              <button
                className=' float-right py-3 px-11 mr-4 text-typo-base-bold text-brand-gray-500 rounded-sm cursor-pointer hover:bg-gray-300'
                type='button'
                onClick={handleClose}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
