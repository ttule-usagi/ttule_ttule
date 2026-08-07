// PlanMemoItemForm.tsx
'use client';

import { Icon } from '@/components/common/Icon';

interface PlanMemoItemFormProps {
  placeName: string;
  visitTime: string;
  memoContent: string;
  onPlaceNameChange: (value: string) => void;
  onVisitTimeChange: (value: string) => void;
  onMemoContentChange: (value: string) => void;
}

export default function PlanMemoItemForm({
  placeName,
  visitTime,
  memoContent,
  onPlaceNameChange,
  onVisitTimeChange,
  onMemoContentChange,
}: PlanMemoItemFormProps) {
  return (
    <div className='flex flex-col gap-2'>
      {/* 제목 입력 */}
      <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 h-10 flex items-center'>
        <input
          type='text'
          value={placeName}
          onChange={(e) => onPlaceNameChange(e.target.value)}
          placeholder='제목을 입력하세요'
          className='bg-transparent text-typo-base-bold text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400'
        />
      </div>

      {/* 방문 시간 입력 */}
      <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm pl-2 py-1 h-8 flex items-center gap-1'>
        <Icon
          name='Clock'
          size={16}
          className='text-brand-gray-600 shrink-0'
        />
        <input
          type='time'
          step={300}
          value={visitTime}
          onChange={(e) => onVisitTimeChange(e.target.value)}
          className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400'
        />
      </div>

      {/* 메모 입력 */}
      <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 min-h-18 max-h-30'>
        <textarea
          value={memoContent}
          onChange={(e) => onMemoContentChange(e.target.value)}
          placeholder='메모를 입력하세요'
          className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none field-sizing-content resize-none placeholder:text-brand-gray-400 min-h-14'
        />
      </div>
    </div>
  );
}
