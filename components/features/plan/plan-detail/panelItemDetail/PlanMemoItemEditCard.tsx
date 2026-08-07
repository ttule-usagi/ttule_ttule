'use client';

import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';

import NotchRows from './NotchRows';
import PlanMemoItemForm from './PlanMemoItemForm';
import { useDragHandle } from './SortablePlanItem';

interface PlanMemoItemEditCardProps {
  item: PlanItem;
  onClose: () => void;
  onSave: (updated: { placeName: string; visitTime: string | null; memoContent: string | null }) => void;
  isSaving?: boolean;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanMemoItemEditCard({ item, isSaving, onClose, onSave }: PlanMemoItemEditCardProps) {
  const [placeName, setPlaceName] = useState(item.placeName);
  const [visitTime, setVisitTime] = useState(formatVisitTime(item.visitTime));
  const [memoContent, setMemoContent] = useState(item.memoContent ?? '');
  const { attributes, listeners } = useDragHandle();

  const handleSave = () => {
    if (!placeName.trim()) return;
    onSave({ placeName, visitTime: visitTime || null, memoContent: memoContent || null });
  };

  return (
    <div className='relative bg-white shadow-sm w-full cursor-default'>
      <NotchRows count={1} />

      {/* 닫기 버튼 */}
      <div className='absolute left-4 top-5'>
        <button
          onClick={onClose}
          className='flex items-center justify-center size-6.5 rounded-full bg-brand-gray-200 cursor-pointer'
          aria-label='닫기'
        >
          <Icon
            name='XClose'
            size={26}
            className='text-brand-gray-600'
          />
        </button>
      </div>

      <div className='pl-13 pr-12 py-4 flex flex-col gap-2'>
        <PlanMemoItemForm
          placeName={placeName}
          visitTime={visitTime}
          memoContent={memoContent}
          onPlaceNameChange={setPlaceName}
          onVisitTimeChange={setVisitTime}
          onMemoContentChange={setMemoContent}
        />

        {/* 취소/저장 버튼 */}
        <div className='flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 flex items-center justify-center py-2 border border-brand-gray-200 rounded-1'
          >
            <span className='text-typo-description text-brand-gray-500'>취소</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!placeName.trim() || isSaving}
            className='flex-1 flex items-center justify-center py-2 bg-brand-blue-700 rounded-sm text-brand-gray-50'
          >
            <span>{isSaving ? '저장 중...' : '저장'}</span>
          </button>
        </div>
      </div>

      {/* 드래그 핸들 */}
      <button
        className='absolute right-2 top-4 cursor-grab'
        aria-label='순서 변경'
        {...attributes}
        {...listeners}
      >
        <Icon
          name='Hamburger'
          size={32}
          className='text-brand-gray-400'
        />
      </button>
    </div>
  );
}
