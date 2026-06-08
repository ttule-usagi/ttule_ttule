'use client';

import { Icon } from '@/components/common/Icon';
import EmojiPicker from '@/components/features/Place/EmojiPicker';
import { useCreatePlaceList } from '@/hooks/new-place-list/useCreatePlaceList';
import { IconType } from '@/lib/emoji';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

interface CreatePlaceListErrorType {
  type: 'FIELD' | 'UPLOAD';
  message: string;
}

export default function CreatePlace() {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<CreatePlaceListErrorType | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isOpenIconMenu, setIsOpenIconMenu] = useState<boolean>(false);
  const [selectIcon, setSelectedIcon] = useState<IconType | null>(null);

  const { mutateAsync: createPlaceList } = useCreatePlaceList();
  const router = useRouter();

  const handleSelectIcon = (value: IconType) => {
    setSelectedIcon(value);
    setIsOpenIconMenu(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError({ type: 'FIELD', message: '리스트 제목을 입력해주세요.' });
      return;
    }

    try {
      const listId = await createPlaceList({
        title: title,
        icon: (selectIcon && selectIcon.emoji) || undefined,
        description: description.trim() || undefined,
      });
      if (listId) router.push(`/places/${listId}`);
    } catch (error) {
      console.error('장소 리스트 생성 실패', error);
      setError({ type: 'UPLOAD', message: '장소 리스트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center'>
        <p className='flex-1 text-typo-big-title text-brand-blue-700'>장소 리스트 생성</p>
        <button
          onClick={handleSubmit}
          className='rounded-lg box-border font-light px-3 py-2 text-brand-gray-0 bg-brand-blue-700 flex items-center justify-center'
        >
          저장하기
        </button>
      </div>

      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <label
            htmlFor='title'
            className='text-brand-gray-600'
          >
            리스트 제목
          </label>
          <input
            placeholder='리스트 제목 입력'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='title'
            className='create-place-input'
          />
          {error && error.type === 'FIELD' && (
            <p className='text-typo-description text-tag-red-text'>{error.message}</p>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <label
            htmlFor='icon'
            className='text-brand-gray-600'
          >
            아이콘
          </label>

          <div className='relative'>
            <button
              type='button'
              onClick={() => setIsOpenIconMenu(!isOpenIconMenu)}
              className='create-place-input'
            >
              <span className='font-mona12'>{selectIcon ? selectIcon.emoji : '+'}</span>
              <span className='flex-1 text-ellipsis'>{selectIcon ? selectIcon.name : '아이콘 선택'}</span>
              <Icon
                name='ChevronDown'
                size={24}
              />
            </button>

            {isOpenIconMenu && (
              <div className='absolute z-10'>
                <Suspense fallback={<div>로딩중...</div>}>
                  <EmojiPicker onClick={(icon) => handleSelectIcon(icon)} />
                </Suspense>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <label
            htmlFor='description'
            className='text-brand-gray-600'
          >
            리스트 설명
          </label>
          <textarea
            id='description'
            placeholder='설명'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='resize-none create-place-input'
          />
        </div>
      </form>
    </div>
  );
}
