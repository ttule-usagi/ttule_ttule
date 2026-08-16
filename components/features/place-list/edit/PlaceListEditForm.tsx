'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import EmptyState from '@/components/common/EmptyState';
import { useConfirmDeletePlace } from '@/hooks/place-list/useConfirmDeletePlace';
import { useUpdatePlaceList } from '@/hooks/place-list/useUpdatePlaceList';
import { IconType } from '@/lib/emoji';
import { EditablePlace, EditablePlaceParams, PlaceListDetail } from '@/types/placeList';

import EditableOverviewField, { PlaceListErrorType } from '../EditableOverviewField';

import EditPlace from './EditPlace';

interface PlaceListEditFormProps {
  listId: string;
  initialDetail: PlaceListDetail;
  initialIcon?: IconType | null;
  initialPlaces: EditablePlace[];
}

export default function PlaceListEditForm({
  listId,
  initialDetail,
  initialPlaces,
  initialIcon,
}: PlaceListEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(initialDetail.title);
  const [description, setDescription] = useState<string>(initialDetail.description);
  const [selectIcon, setSelectedIcon] = useState<IconType | undefined | null>(initialIcon);
  const [places, setPlaces] = useState<EditablePlace[]>(initialPlaces);
  const [error, setError] = useState<PlaceListErrorType | null>(null);
  const { mutateAsync: updatePlaceList } = useUpdatePlaceList(listId);
  const { confirmDeletePlaceList } = useConfirmDeletePlace(listId, (placeId) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
  });

  const handlePlaceMemoChange = ({ id, memoContent }: EditablePlaceParams) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, memoContent } : p)));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError({ type: 'FIELD', message: '리스트 제목을 입력해주세요.' });
      return;
    }

    if (title.length > 20) {
      setError({ type: 'FIELD', message: '리스트 제목은 20자 이내여야 합니다.' });
      return;
    }

    // 값이 바뀐 장소 데이터만 전송
    const changedPlaces = places.filter((p) => {
      const original = initialPlaces.find((initial) => initial.id === p.id);
      return original?.memoContent !== p.memoContent;
    });

    try {
      await updatePlaceList({
        listId: listId,
        newTitle: title,
        newIcon: (selectIcon && selectIcon?.emoji) || null,
        newDescription: (description && description.trim()) || null,
        places: changedPlaces.map((p) => ({ id: p.id, memoContent: p.memoContent })),
      });
      router.back();
    } catch (error) {
      console.error('장소 리스트 편집 실패', error);
      setError({ type: 'UPLOAD', message: '장소 리스트 편집에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }
  };

  return (
    <div className='flex flex-col h-full gap-6'>
      <header className='px-4 flex items-center flex-none'>
        <p className='flex-1 text-typo-big-title text-brand-blue-700'>장소 리스트 관리</p>
        <button
          onClick={handleSave}
          className='rounded-lg box-border font-light px-3 py-2 text-brand-gray-0 bg-brand-blue-700 flex items-center justify-center cursor-pointer'
        >
          저장하기
        </button>
      </header>

      <div className='px-4 pb-12 flex flex-col gap-6 overflow-y-auto'>
        {/* 리스트 개요 */}
        <EditableOverviewField
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          icon={selectIcon}
          onSelectIcon={setSelectedIcon}
          error={error}
        />

        {/* 저장된 장소 */}
        <div className='flex flex-col gap-4 mt-6'>
          {places.length > 0 ? (
            places.map((p) => (
              <EditPlace
                key={p.id}
                place={p}
                onMemoChange={handlePlaceMemoChange}
                onDeletePlace={confirmDeletePlaceList}
              />
            ))
          ) : (
            <EmptyState message='저장된 장소가 아직 없습니다.' />
          )}
        </div>
      </div>
    </div>
  );
}
