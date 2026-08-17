'use client';

import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';

import type { EditModeItemDraft } from './EditModeItem';
import NotchRows from './NotchRows';
import PlanMemoItemForm from './PlanMemoItemForm';
import { useDragHandle } from './SortablePlanItem';

interface EditModeMemoItemProps {
  item: PlanItem;
  draft: EditModeItemDraft;
  onChange: (patch: Partial<EditModeItemDraft>) => void;
  onRemove: () => void;
}

export default function EditModeMemoItem({ item, draft, onChange, onRemove }: EditModeMemoItemProps) {
  const { attributes, listeners } = useDragHandle();

  return (
    <div className='relative bg-white shadow-sm w-full rounded-sm'>
      <NotchRows count={1} />
      <div className='pl-13 pr-12 py-4 flex flex-col gap-2'>
        <PlanMemoItemForm
          placeName={draft.placeName ?? item.placeName}
          visitTime={draft.visitTime}
          memoContent={draft.memoContent}
          onPlaceNameChange={(placeName) => onChange({ placeName })}
          onVisitTimeChange={(visitTime) => onChange({ visitTime })}
          onMemoContentChange={(memoContent) => onChange({ memoContent })}
        />
      </div>

      <div className='absolute left-4 top-5'>
        <button
          onClick={onRemove}
          className='flex items-center justify-center size-6.5 rounded-full  cursor-pointer hover:bg-brand-gray-100'
          aria-label='항목 삭제'
        >
          <Icon
            name='XClose'
            size={26}
            className='text-brand-gray-600 hover:text-brand-blue-700'
          />
        </button>
      </div>

      <button
        className='absolute right-2 top-4'
        aria-label='순서 변경'
        {...attributes}
        {...listeners}
      >
        <Icon
          name='Hamburger'
          size={32}
          className='text-brand-gray-400 hover:text-brand-blue-600'
        />
      </button>
    </div>
  );
}
