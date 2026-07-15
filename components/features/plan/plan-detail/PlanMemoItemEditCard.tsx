'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';
import { addPlanMemoItem } from '@/lib/actions/planItem';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const [placeName, setPlaceName] = useState(item?.placeName ?? '');
  const [visitTime, setVisitTime] = useState(formatVisitTime(item?.visitTime ?? null));
  const [memoContent, setMemoContent] = useState(item?.memoContent ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!placeName.trim()) return;

    if (isNew) {
      // 신규 생성
      if (isSubmitting) return;
      setIsSubmitting(true);

      const result = await addPlanMemoItem({
        scheduleId,
        placeName: placeName.trim(),
        memoContent: memoContent || null,
        visitTime: visitTime || null,
      });

      setIsSubmitting(false);

      if (!result.error) {
        await queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(scheduleId),
          refetchType: 'active',
        });
        onClose();
      }
    } else {
      // 기존 수정
      onSave({
        placeName: placeName.trim(),
        visitTime: visitTime || null,
        memoContent: memoContent || null,
      });
    }
  };

  return (
    <div className='relative bg-white rounded-[8px] shadow-sm overflow-hidden w-full'>
      <div className='pl-[51px] pr-[48px] py-[17px] flex flex-col gap-[8px]'>
        {/* 제목 입력 */}
        <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-[4px] px-[12px] py-[8px] h-[40px] flex items-center'>
          <input
            type='text'
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder='제목을 입력하세요'
            className='bg-transparent text-typo-base-bold text-brand-gray-600 w-full outline-none placeholder:text-brand-gray-400'
          />
        </div>

        {/* 방문 시간 입력 */}
        <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-[4px] pl-[8px] py-[5px] h-[30px] flex items-center gap-[4px]'>
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
        <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-[4px] px-[12px] py-[8px] min-h-[70px] max-h-[120px]'>
          <textarea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder='메모를 입력하세요'
            className='bg-transparent text-typo-base text-brand-gray-600 w-full outline-none resize-none placeholder:text-brand-gray-400 min-h-[54px]'
          />
        </div>

        {/* 취소/저장 버튼 */}
        <div className='flex gap-[8px]'>
          <button
            onClick={onClose}
            className='flex-1 flex items-center justify-center py-[8px] border border-brand-gray-200 rounded-[4px]'
          >
            <span className='text-typo-description text-brand-gray-500'>취소</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!placeName.trim() || isSubmitting}
            className='flex-1 flex items-center justify-center py-[8px] bg-brand-blue-700 rounded-[4px] text-brand-gray-50'
          >
            <span>{isNew ? (isSubmitting ? '추가 중...' : '추가하기') : '저장'}</span>
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <div className='absolute left-[16px] top-[21px]'>
        <button
          onClick={onClose}
          className='flex items-center justify-center size-[26px] rounded-full bg-brand-gray-200'
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
        className='absolute right-[8px] top-[17px]'
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
