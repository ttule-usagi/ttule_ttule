'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import { deletePlanItem, duplicatePlanItem } from '@/lib/actions/planItem';
import { useModalStore } from '@/lib/store/modalStore';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { PlanItem } from '@/types/plan';

import NotchRows from './NotchRows';
import { useDragHandle } from './SortablePlanItem';

interface PlanItemEditCardProps {
  item: PlanItem;
  onClose: () => void;
  onSave: (updated: { visitTime: string; memoContent: string }) => void;
  isSaving?: boolean;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanItemEditCard({ item, onClose, onSave, isSaving }: PlanItemEditCardProps) {
  const queryClient = useQueryClient();
  const { open } = useModalStore();
  const [visitTime, setVisitTime] = useState(formatVisitTime(item.visitTime));
  const [memoContent, setMemoContent] = useState(item.memoContent ?? '');
  const { attributes, listeners } = useDragHandle();

  const categoryLabel = item.placeCategory ? getPlaceCategoryLabel(item.placeCategory) : null;

  const handleSave = () => {
    onSave({ visitTime, memoContent });
  };

  const handleDuplicate = async () => {
    const result = await duplicatePlanItem(item);
    if (result.success) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(item.scheduleId),
        refetchType: 'active',
      });
    }
  };

  const handleDelete = async () => {
    const result = await deletePlanItem(item.id);

    if (result.success) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(item.scheduleId),
        refetchType: 'active',
      });
    }
  };

  return (
    <div className='relative bg-white shadow-lg plan-item-card rounded-sm cursor-default'>
      <NotchRows />
      <div className='p-4 flex gap-2 items-start pr-12'>
        {/* 닫기 버튼 */}
        <div className='flex flex-col items-center w-7 shrink-0 mt-1 '>
          <button
            onClick={() =>
              open({
                type: 'deletePlanItem',
                props: { onConfirm: handleDelete },
              })
            }
            className='flex items-center justify-center size-7 rounded-full bg-brand-gray-200 cursor-pointer'
            aria-label='닫기'
          >
            <Icon
              name='XClose'
              size={26}
              className='text-brand-gray-600'
            />
          </button>
        </div>

        {/* 편집 폼 */}
        <div className='flex flex-col gap-2 flex-1 min-w-0'>
          {/* 장소명 + 카테고리 */}
          <div className='flex flex-col items-start'>
            <p className='text-typo-sub-title text-brand-blue-700 whitespace-break-spaces w-full pr-11'>
              {item.placeName}
            </p>
            {item.placeCategory && <p className='text-typo-description text-brand-gray-400'>{categoryLabel}</p>}
          </div>

          {/* 방문 시간 입력 */}
          <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm flex items-center gap-1 h-8 pl-2 py-1'>
            <Icon
              name='Clock'
              size={16}
              className='text-brand-gray-600 shrink-0'
            />
            <input
              type='time'
              step={300}
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400'
            />
          </div>

          {/* 메모 입력 */}
          <textarea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder='메모를 입력하세요'
            rows={3}
            className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 text-typo-desciption text-brand-gray-600 w-full outline-none resize-y placeholder:text-brand-gray-400 min-h-18'
          />

          {/* 취소/저장 버튼 */}
          <div className='flex gap-2'>
            <button
              onClick={onClose}
              className='flex-1 flex items-center justify-center py-2 border border-brand-gray-200 rounded-sm'
            >
              <span className='text-typo-description text-brand-gray-500'>취소</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='flex-1 flex items-center justify-center py-2 bg-brand-blue-700 rounded-sm'
            >
              <span className='text-typo-description font-semibold text-white'>{isSaving ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* 복사/드래그 버튼 */}
        <div className='absolute top-4 right-4  flex gap-3 items-center shrink-0 mt-1'>
          <button
            aria-label='복제'
            onClick={handleDuplicate}
            className='cursor-pointer'
          >
            <Icon
              name='Duplicate'
              size={24}
              className='text-brand-gray-400'
            />
          </button>
          <button
            aria-label='순서 변경'
            {...attributes}
            {...listeners}
            className='cursor-grab'
          >
            <Icon
              name='Hamburger'
              size={32}
              className='text-brand-gray-400'
            />
          </button>
        </div>
      </div>
    </div>
  );
}
