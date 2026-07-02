'use client';

import { useState } from 'react';
import { useGetAllPlaceLists } from '@/hooks/place-list/useGetAllPlaceLists';
import { useQueryClient } from '@tanstack/react-query';
import { addPlaceToList } from '@/lib/actions/places';
import type { CorePlaceDetail } from '@/types/CorePlace';
import type { AllPlaceLists } from '@/types/placeList';
import { Icon } from '@/components/common/Icon';

interface SaveToListModalProps {
  placeDetail: CorePlaceDetail;
  onClose: () => void;
  onCreateNewList?: () => void;
}

// 이미 저장된 리스트 id Set
function useSavedListIds(placeDetail: CorePlaceDetail) {
  return new Set(placeDetail.savedLists.map((l) => l.id));
}

export default function SaveToListModal({ placeDetail, onClose, onCreateNewList }: SaveToListModalProps) {
  const queryClient = useQueryClient();
  const savedListIds = useSavedListIds(placeDetail);

  // owned + shared 모두 가져옴
  const { data: ownedLists } = useGetAllPlaceLists('owned');
  const { data: sharedLists } = useGetAllPlaceLists('shared');

  const allLists = [...ownedLists.items, ...sharedLists.items];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!selectedId) return;
    setIsLoading(true);
    setErrorMessage(null);

    const result = await addPlaceToList({ placeListId: selectedId, placeDetail });

    setIsLoading(false);

    if (result.error) {
      if (result.error === 'ALREADY_SAVED') {
        setErrorMessage('이미 저장된 장소입니다.');
      } else {
        setErrorMessage('저장에 실패했습니다. 다시 시도해주세요.');
      }
      return;
    }
    // place detail 캐시 무효화 → 즉시 재요청
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['core-place', placeDetail.place.id],
        refetchType: 'active',
      }),
      queryClient.invalidateQueries({
        queryKey: ['place-list'],
        refetchType: 'active',
      }),
    ]);
    onClose();
  };

  return (
    // 모달 오버레이
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-lg w-60 flex flex-col gap-4 px-5 py-4'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-between'>
          <p className='text-typo-base-bold text-brand-gray-700'>리스트에 저장</p>
          <button
            onClick={onClose}
            aria-label='닫기'
          >
            <Icon
              name='XClose'
              size={26}
              className='text-brand-gray-600'
            />
          </button>
        </div>

        {/* 새로운 리스트 버튼 */}
        <button
          onClick={onCreateNewList}
          className='w-full flex items-center justify-center gap-1 py-2 border border-brand-gray-300 rounded-1'
        >
          <Icon
            name='Plus'
            size={18}
            className='text-brand-blue-700'
          />
          <span className='text-typo-description text-brand-blue-700'>새로운 리스트</span>
        </button>

        {/* 리스트 목록 */}
        <div className='flex flex-col gap-4'>
          {allLists.map((list) => {
            const isAlreadySaved = savedListIds.has(list.id);
            const isSelected = selectedId === list.id;

            return (
              <button
                key={list.id}
                onClick={() => {
                  if (isAlreadySaved) return;
                  setSelectedId(isSelected ? null : list.id);
                  setErrorMessage(null);
                }}
                disabled={isAlreadySaved}
                className={`w-full flex flex-col items-start text-left ${
                  isAlreadySaved ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                } ${isSelected ? 'opacity-100' : ''}`}
              >
                <p
                  className={`text-typo-description ${
                    isSelected ? 'text-brand-blue-700 font-medium' : 'text-brand-gray-700'
                  }`}
                >
                  {list.title}
                  {isAlreadySaved && <span className='ml-1 text-typo-caption text-brand-gray-400'>저장됨</span>}
                </p>
                <p className='text-typo-caption text-brand-gray-500'>
                  {list.isPublic ? '공유됨' : '비공개'}
                  {list.placeCount > 0 && ` · ${list.placeCount}개 장소`}
                </p>
              </button>
            );
          })}
        </div>

        {/* 에러 메시지 */}
        {errorMessage && <p className='text-typo-caption text-tag-red-text text-center'>{errorMessage}</p>}

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          disabled={!selectedId || isLoading}
          className={`w-full py-2 rounded-lg text-typo-base-bold text-center transition-colors ${
            selectedId && !isLoading
              ? 'bg-brand-blue-700 text-white'
              : 'bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? '저장 중...' : '완료'}
        </button>
      </div>
    </div>
  );
}
