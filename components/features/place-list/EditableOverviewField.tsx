import { Suspense, useState } from 'react';

import { Icon } from '@/components/common/Icon';
import { IconType } from '@/lib/emoji';

import EmojiPicker from './create/EmojiPicker';

export interface PlaceListErrorType {
  type: 'FIELD' | 'UPLOAD';
  message: string;
}

interface EditableOverviewFieldProps {
  title: string;
  onTitleChange: (value: string) => void;
  icon?: IconType | null;
  onSelectIcon: (icon: IconType | null) => void;
  description?: string | null;
  onDescriptionChange: (value: string) => void;
  error: PlaceListErrorType | null;
}

export default function EditableOverviewField({
  title,
  onTitleChange,
  icon,
  onSelectIcon,
  description,
  onDescriptionChange,
  error,
}: EditableOverviewFieldProps) {
  const [isOpenIconMenu, setIsOpenIconMenu] = useState<boolean>(false);

  const handleSelectIcon = (value: IconType) => {
    onSelectIcon(value);
    setIsOpenIconMenu(false);
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <label
            htmlFor='title'
            className='text-brand-gray-600'
          >
            리스트 제목
          </label>
          <input
            placeholder='리스트 제목 입력'
            value={title ?? ''}
            onChange={(e) => onTitleChange(e.target.value)}
            id='title'
            className='create-place-input'
            maxLength={20}
          />
          {error && error.type === 'FIELD' && (
            <p className='text-typo-description text-tag-red-text -mt-1'>{error.message}</p>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <span
            id='icon-label'
            className='text-brand-gray-600'
          >
            아이콘
          </span>

          <div className='flex flex-col gap-2'>
            <div className='flex gap-1.5 w-full'>
              <button
                type='button'
                aria-labelledby='icon-label'
                aria-haspopup='true'
                aria-expanded={isOpenIconMenu}
                onClick={() => setIsOpenIconMenu(!isOpenIconMenu)}
                className={`flex-1 min-w-0 create-place-input gap-2.5 cursor-pointer ${icon ? 'text-brand-gray-700' : 'text-brand-gray-400'}`}
              >
                <span className='font-mona12 text-typo-base'>
                  {icon ? (
                    icon.emoji
                  ) : (
                    <Icon
                      name='Plus'
                      size={20}
                    />
                  )}
                </span>
                <span className='flex-1 min-w-0 text-start text-ellipsis overflow-hidden whitespace-nowrap'>
                  {icon ? icon.name : '아이콘 선택'}
                </span>
                <Icon
                  name='ChevronDown'
                  size={24}
                />
              </button>
              {icon && (
                <button
                  type='button'
                  onClick={() => onSelectIcon(null)}
                  className='bg-tag-red-text text-brand-gray-0 rounded-sm px-2 w-14 cursor-pointer font-light hover:bg-[#da4b46]'
                >
                  제거
                </button>
              )}
            </div>

            {isOpenIconMenu && (
              <div className='w-full'>
                <Suspense fallback={<div className='w-full text-brand-gray-400 text-center'>Loading...</div>}>
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
            value={description ?? ''}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className='resize-none create-place-input'
          />
        </div>
      </div>
      {error && error.type === 'UPLOAD' && (
        <p className='text-typo-description text-tag-red-text -mt-1'>{error.message}</p>
      )}
    </>
  );
}
