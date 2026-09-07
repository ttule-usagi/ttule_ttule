'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import EmptyState from '@/components/common/EmptyState';
import { useConfirmDeletePlace } from '@/hooks/place-list/useConfirmDeletePlace';
import { useGetPlaceListTags } from '@/hooks/place-list/useGetPlaceListTags';
import { useTagFilter } from '@/hooks/place-list/useTagFilter';
import { useUpdatePlaceList } from '@/hooks/place-list/useUpdatePlaceList';
import { IconType } from '@/lib/emoji';
import { EditablePlace, EditablePlaceParams, PlaceListDetail } from '@/types/placeList';

import EditableOverviewField, { PlaceListErrorType } from '../EditableOverviewField';

import EditPlace from './EditPlace';
import EditTagList from './EditTagList';

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
  const { mutateAsync: updatePlaceList, isPending } = useUpdatePlaceList(listId);
  const { confirmDeletePlaceList } = useConfirmDeletePlace(listId, (placeId) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
  });
  const { data: listTags } = useGetPlaceListTags(listId);
  const { activeTagIds, handleToggleTag } = useTagFilter();

  const handlePlaceMemoChange = ({ id, memoContent }: Omit<EditablePlaceParams, 'tagIds'>) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, memoContent } : p)));
  };

  const handleTogglePlaceTags = (placeId: string, tagId: string) => {
    setPlaces((prev) =>
      prev.map((place) => {
        if (place.id !== placeId) return place;
        const tagIds = place.tagIds.includes(tagId)
          ? place.tagIds.filter((id) => id !== tagId)
          : [...place.tagIds, tagId];
        return { ...place, tagIds };
      }),
    );
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
      if (!original) return false;

      // 메모가 바뀌었거나, 태그가 바뀌었으면 바뀐 장소로 간주
      const memoChanged = original?.memoContent !== p.memoContent;
      const tagChanged =
        original.tagIds.length !== p.tagIds.length || !original.tagIds.every((id) => p.tagIds.includes(id));

      return memoChanged || tagChanged;
    });

    try {
      await updatePlaceList({
        listId: listId,
        newTitle: title,
        newIcon: (selectIcon && selectIcon?.emoji) || null,
        newDescription: (description && description.trim()) || null,
        places: changedPlaces.map((p) => ({ id: p.id, memoContent: p.memoContent, tagIds: p.tagIds })),
      });
      router.back();
    } catch (error) {
      console.error('장소 리스트 편집 실패', error);
      setError({ type: 'UPLOAD', message: '장소 리스트 편집에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }
  };

  const filteredPlaces = useMemo(() => {
    if (activeTagIds.size === 0) return places;
    return places.filter((place) => place.tagIds.some((id) => activeTagIds.has(id)));
  }, [activeTagIds, places]);

  return (
    <div className='flex flex-col h-full gap-6'>
      <header className='px-4 flex items-center flex-none'>
        <p className='flex-1 text-typo-big-title text-brand-blue-700'>장소 리스트 관리</p>
        <button
          onClick={handleSave}
          className='rounded-lg box-border font-light px-3 py-2 text-brand-gray-0 bg-brand-blue-700 flex items-center justify-center cursor-pointer hover:bg-brand-blue-800'
          disabled={isPending}
        >
          {isPending ? '저장 중...' : '저장하기'}
        </button>
      </header>

      <div className='px-4 pb-12 flex flex-col gap-12 overflow-y-auto'>
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

        <div className='flex flex-col gap-4'>
          {/* 태그 */}
          <div className='flex gap-2 text-typo-description items-center'>
            <EditTagList
              listId={listId}
              listTags={listTags}
              activeTagIds={activeTagIds}
              onToggleTag={handleToggleTag}
            />
          </div>

          {/* 저장된 장소 */}
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((p) => (
              <EditPlace
                key={p.id}
                place={p}
                onMemoChange={handlePlaceMemoChange}
                onDeletePlace={confirmDeletePlaceList}
                listTags={listTags}
                onToggleTag={handleTogglePlaceTags}
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
