'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import { useConfirmDeletePlace } from '@/hooks/place-list/useConfirmDeletePlace';
import { useGetMyRole } from '@/hooks/place-list/useGetMyRole';
import { useUpdatePlace } from '@/hooks/place-list/useUpdatePlace';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { Place } from '@/types/placeList';

import AuthorityWrapper from '../../AuthorityWrapper';

export default function PlaceItem({
  place,
  listId,
  onClickItem,
}: {
  place: Place;
  listId: string;
  onClickItem: (id: string) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [memo, setMemo] = useState<string | null>(place.memoContent);
  const { confirmDeletePlaceList } = useConfirmDeletePlace(listId);
  const { data: myRole } = useGetMyRole(listId);
  const { mutate: updatePlace } = useUpdatePlace(listId);

  const handleOpenEdit = () => {
    // 전체 편집 모드에서 돌아왔을 때 메모 수정 사항을 바로 반영
    setMemo(place.memoContent);
    setIsEdit(true);
  };

  const handleEdit = () => {
    updatePlace({ placeId: place.id, memo }, { onSuccess: () => setIsEdit(false) });
  };

  return (
    <div
      className='w-full flex gap-3.25 bg-brand-gray-0 p-3 rounded-sm border border-brand-blue-700 items-start cursor-pointer'
      onClick={(e) => {
        e.stopPropagation();
        if (!isEdit) onClickItem(place.corePlaceId);
      }}
    >
      {!isEdit && (
        <div className='w-20 h-20 shrink-0 border border-brand-gray-200 rounded-xs bg-brand-blue-50'>
          <Image
            src={place.thumbnail || '/images/not-found.webp'}
            alt={place.thumbnail ? 'thumbnail' : 'not-found'}
            width={80}
            height={80}
            className='w-full h-full object-cover rounded-xs'
          />
        </div>
      )}

      <div className='flex flex-col gap-1 flex-1'>
        <div className='flex justify-between items-center'>
          {isEdit && (
            <Icon
              name='XClose'
              size={26}
              className='cursor-pointer text-brand-gray-400 mr-0.5'
              onClick={() => confirmDeletePlaceList(place.customName, place.id)}
            />
          )}
          <p className='flex-1 text-typo-sub-title text-brand-gray-600 font-medium'>{place.customName}</p>
          {!isEdit && (
            <AuthorityWrapper
              role={myRole}
              requiredRole='editor'
            >
              <div className='flex flex-col items-center justify-center my-0.5 ml-1.5 self-start'>
                <Icon
                  name={'Edit'}
                  size={26}
                  className='cursor-pointer text-brand-gray-300'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit();
                  }}
                />
              </div>
            </AuthorityWrapper>
          )}
        </div>

        {!isEdit && place.category && (
          <p className='text-brand-gray-400 text-typo-description'>{getPlaceCategoryLabel(place.category)}</p>
        )}
        {!isEdit ? (
          <>
            {place.memoContent && (
              <p className='text-brand-gray-600 text-typo-description whitespace-pre-wrap'>{place.memoContent}</p>
            )}

            {/* TODO: 2차 MVP 때 태그 적용 */}
            {/* <div className='flex gap-1 items-center overflow flex-wrap'>
              {place.tags.map((item) => (
                <PlaceTag
                  key={item.id}
                  tag={item}
                  isRounded={true}
                />
              ))}
            </div> */}
          </>
        ) : (
          <div>
            <textarea
              placeholder='메모 추가'
              value={memo ?? ''}
              className='bg-brand-gray-100 min-h-16 text-typo-base px-3 py-2 text-brand-gray-600 border border-brand-gray-200 outline-none rounded-sm w-full resize-none field-sizing-content'
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
                className='flex-1 bg-brand-blue-700 text-brand-gray-0 rounded-sm py-2 cursor-pointer'
                onClick={handleEdit}
              >
                저장하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
