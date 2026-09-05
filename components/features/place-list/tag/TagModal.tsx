import { useState } from 'react';

import EmptyState from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { useGetPlaceListTags } from '@/hooks/place-list/useGetPlaceListTags';
import { useUpdateTags } from '@/hooks/place-list/useUpdateTags';
import { TagColor } from '@/lib/constants/tag';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { TagRowParams } from '@/types/placeList';

import TagRow from './TagRow';

export default function TagModal({ listId }: { listId: string }) {
  const { close } = useModalStore();
  const { data: existingTags } = useGetPlaceListTags(listId);
  const [newTag, setNewTag] = useState<TagRowParams[]>(() =>
    existingTags.map((tag) => ({
      key: crypto.randomUUID(),
      id: tag.id,
      name: tag.name,
      color: tag.color,
    })),
  );
  const { mutateAsync: updateTags, isPending } = useUpdateTags();
  const [error, setError] = useState<string | null>(null);

  const handleAddRow = () => {
    setNewTag((prev) => [...prev, { key: crypto.randomUUID(), name: '', color: 'red' }]);
  };

  const handleDeleteRow = (key: string) => {
    setNewTag((prev) => prev.filter((tag) => tag.key !== key));
  };

  const handleChangeName = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag((prev) => prev.map((tag) => (tag.key === key ? { ...tag, name: e.target.value } : tag)));
  };

  const handleChangeColor = (key: string, color: TagColor) => {
    setNewTag((prev) => prev.map((tag) => (tag.key === key ? { ...tag, color } : tag)));
  };

  const handleSubmit = async () => {
    if (newTag.length === 0) return;
    if (newTag.some((tag) => !tag.name.trim())) {
      setError('태그명을 입력해주세요.');
      return;
    }

    try {
      setError(null);
      await updateTags(
        { listId, tags: newTag },
        {
          onSuccess: (result) => {
            setNewTag(
              result.data.map((tag) => ({
                key: crypto.randomUUID(),
                id: tag.id,
                name: tag.name,
                color: tag.color,
              })),
            );
          },
        },
      );
    } catch (error) {
      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '태그', action: '편집' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '태그', action: '편집' });

      setError(message);
    }
  };

  return (
    <div
      className='modal-overlay'
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        className='relative flex flex-col bg-white rounded-lg min-h-100 h-187 max-h-[80vh] min-w-126 overflow-hidden pt-7 px-6'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex items-center justify-between'>
          <span className='text-typo-title text-brand-blue-800'>태그 관리</span>
          <button
            onClick={close}
            className='text-brand-gray-500 rounded-full cursor-pointer hover:bg-brand-gray-100 hover:text-brand-blue-700'
          >
            <Icon
              name='XClose'
              size={32}
            />
          </button>
        </header>

        <button
          className='w-full flex items-center justify-center gap-2.5 border border-brand-blue-700 text-brand-blue-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-blue-700 hover:text-brand-gray-0 text-typo-base mt-7 mb-3'
          onClick={handleAddRow}
        >
          <Icon
            name='Plus'
            size={24}
          />
          태그 추가
        </button>

        <div className='flex flex-col gap-2 min-h-0 overflow-y-auto flex-1 -mx-6 px-6 pb-26'>
          {newTag.length > 0 ? (
            newTag.map((tag) => (
              <TagRow
                key={tag.key}
                name={tag.name}
                color={tag.color}
                onDelete={() => handleDeleteRow(tag.key)}
                onChangeColor={(color) => handleChangeColor(tag.key, color)}
                onChangeName={(e) => handleChangeName(tag.key, e)}
              />
            ))
          ) : (
            <EmptyState message='생성한 태그가 아직 없습니다.' />
          )}
        </div>

        <div className='absolute left-0 bottom-0 w-full px-6 py-5 bg-brand-gray-200 rounded-b-lg flex flex-row justify-end gap-3'>
          {error && (
            <span
              role='alert'
              className='text-red-500 text-typo-description text-right'
            >
              {error}
            </span>
          )}
          <button
            className='float-right py-3 px-9 typo-text-base-bold text-white bg-brand-blue-700 rounded-sm hover:bg-brand-blue-800 cursor-pointer'
            form='UpdatePlanInfoForm'
            type='button'
            onClick={handleSubmit}
          >
            {isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
