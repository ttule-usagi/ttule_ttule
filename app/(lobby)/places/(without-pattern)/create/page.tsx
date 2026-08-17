'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import EditableOverviewField, { PlaceListErrorType } from '@/components/features/place-list/EditableOverviewField';
import { useCreatePlaceList } from '@/hooks/new-place-list/useCreatePlaceList';
import { IconType } from '@/lib/emoji';

export default function CreatePlace() {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<PlaceListErrorType | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectIcon, setSelectedIcon] = useState<IconType | null>(null);

  const { mutateAsync: createPlaceList } = useCreatePlaceList();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError({ type: 'FIELD', message: '리스트 제목을 입력해주세요.' });
      return;
    }

    if (title.length > 20) {
      setError({ type: 'FIELD', message: '리스트 제목은 20자 이내여야 합니다.' });
      return;
    }

    try {
      const listId = await createPlaceList({
        title: title,
        icon: (selectIcon && selectIcon.emoji) || undefined,
        description: description.trim() || undefined,
      });
      if (listId) router.replace(`/places/${listId}`);
    } catch (error) {
      console.error('장소 리스트 생성 실패', error);
      setError({ type: 'UPLOAD', message: '장소 리스트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <header className='px-4 flex items-center flex-none pb-6'>
        <p className='flex-1 text-typo-big-title text-brand-blue-700'>장소 리스트 생성</p>
        <button
          onClick={handleSubmit}
          className='rounded-lg box-border font-light px-3 py-2 text-brand-gray-0 bg-brand-blue-700 flex items-center justify-center cursor-pointer hover:bg-brand-blue-800'
        >
          저장하기
        </button>
      </header>

      <div className='px-4 flex flex-col gap-6 pb-12 overflow-y-auto'>
        <EditableOverviewField
          title={title}
          onTitleChange={setTitle}
          icon={selectIcon}
          onSelectIcon={setSelectedIcon}
          description={description}
          onDescriptionChange={setDescription}
          error={error}
        />
      </div>
    </div>
  );
}
