'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';
import { useAddPlanMemoItem } from '@/hooks/plan/useAddPlanMemoItem';

interface PlanMemoItemEditCardProps {
  item?: PlanItem;
  isNew?: boolean;
  scheduleId: string;
  onClose: () => void;
  onSave: (updated: { placeName: string; visitTime: string | null; memoContent: string | null }) => void;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanMemoItemEditCard({
  item,
  isNew = false,
  scheduleId,
  onClose,
  onSave,
}: PlanMemoItemEditCardProps) {
  const [placeName, setPlaceName] = useState(item?.placeName ?? '');
  const [visitTime, setVisitTime] = useState(formatVisitTime(item?.visitTime ?? null));
  const [memoContent, setMemoContent] = useState(item?.memoContent ?? '');
  const { addMemoItem, isSubmitting } = useAddPlanMemoItem();

  const handleSave = async () => {
    if (!placeName.trim()) return;
    const result = await addMemoItem({ scheduleId, placeName, memoContent, visitTime });
    if (!result?.error) onClose();
  };

  return (
    <div className='relative bg-white rounded-lg shadow-sm overflow-hidden w-full'>
      <div className='pl-13 pr-12 py-4 flex flex-col gap-2'>
        {/* 제목 입력 */}
        <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 h-10 flex items-center'>
          <input
            type='text'
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
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
            type='text'
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            placeholder='방문 시간'
            className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400'
          />
        </div>

        {/* 메모 입력 */}
        <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 min-h-18 max-h-30'>
          <textarea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder='메모를 입력하세요'
            className='bg-transparent text-typo-base text-brand-gray-600 w-full outline-none resize-none placeholder:text-brand-gray-400 min-h-14'
          />
        </div>

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
            disabled={!placeName.trim() || isSubmitting}
            className='flex-1 flex items-center justify-center py-2 bg-brand-blue-700 rounded-sm text-brand-gray-50'
          >
            <span>{isNew ? (isSubmitting ? '추가 중...' : '추가하기') : '저장'}</span>
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <div className='absolute left-4 top-5'>
        <button
          onClick={onClose}
          className='flex items-center justify-center size-6.5 rounded-full bg-brand-gray-200'
          aria-label='닫기'
        >
          <Icon
            name='XClose'
            size={26}
            className='text-brand-gray-600'
          />
        </button>
      </div>

      {/* 드래그 핸들 */}
      <button
        className='absolute right-2 top-4'
        aria-label='순서 변경'
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
