'use client';

import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';

import NotchRows from './NotchRows';
import { useDragHandle } from './SortablePlanItem';

export interface EditModeItemDraft {
  placeName?: string;
  visitTime: string;
  memoContent: string;
}

interface EditModeItemProps {
  item: PlanItem;
  draft: EditModeItemDraft;
  onChange: (patch: Partial<EditModeItemDraft>) => void;
  onRemove: () => void;
}

export default function EditModeItem({ item, draft, onChange, onRemove }: EditModeItemProps) {
  const { attributes, listeners } = useDragHandle();

  return (
    <div className='relative bg-white shadow-lg rounded-sm cursor-default'>
      <NotchRows />
      <div className='p-4 flex gap-2 items-start pr-12'>
        {/* 삭제(제외) 버튼 */}
        <div className='flex flex-col items-center w-7 shrink-0 mt-1'>
          <button
            onClick={onRemove}
            className='flex items-center justify-center size-7 rounded-full bg-brand-gray-200 cursor-pointer'
            aria-label='항목 삭제'
          >
            <Icon
              name='XClose'
              size={26}
              className='text-brand-gray-600'
            />
          </button>
        </div>

        {/* 정보 + 입력 폼 */}
        <div className='flex flex-col gap-2 flex-1 min-w-0'>
          <div className='flex flex-col items-start'>
            <p className='text-typo-base-bold text-brand-blue-700 whitespace-break-spaces w-full pr-10'>
              {item.placeName}
            </p>
          </div>

          <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm flex items-center gap-1 h-8 pl-2 py-1'>
            <Icon
              name='Clock'
              size={16}
              className='text-brand-gray-600 shrink-0'
            />
            <input
              type='time'
              step={300}
              value={draft.visitTime}
              onChange={(e) => onChange({ visitTime: e.target.value })}
              className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none'
            />
          </div>

          <textarea
            value={draft.memoContent}
            onChange={(e) => onChange({ memoContent: e.target.value })}
            placeholder='메모를 입력하세요'
            rows={3}
            className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 text-typo-description text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400 min-h-18 field-sizing-content resize-none'
          />
        </div>

        {/* 드래그 핸들 */}
        <button
          aria-label='순서 변경'
          {...attributes}
          {...listeners}
          className='absolute top-4 right-4 cursor-grab'
        >
          <Icon
            name='Hamburger'
            size={32}
            className='text-brand-gray-400'
          />
        </button>
      </div>
    </div>
  );
}
