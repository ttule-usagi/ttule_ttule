'use client';

import { useState } from 'react';
import { PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';

interface PlanItemEditCardProps {
  item: PlanItem;
  onClose: () => void;
  onSave: (updated: { visitTime: string; memoContent: string }) => void;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanItemEditCard({ item, onClose, onSave }: PlanItemEditCardProps) {
  const [visitTime, setVisitTime] = useState(formatVisitTime(item.visitTime));
  const [memoContent, setMemoContent] = useState(item.memoContent ?? '');

  const handleSave = () => {
    onSave({ visitTime, memoContent });
  };

  return (
    <div className='relative bg-white/10 rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] overflow-hidden'>
      <div className='pl-[16px] pr-[16px] py-[17px] flex gap-[8px] items-start'>
        {/* 닫기 버튼 */}
        <div className='flex flex-col items-center w-[26px] shrink-0 mt-[4px]'>
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

        {/* 편집 폼 */}
        <div className='flex flex-col gap-[8px] flex-1 min-w-0'>
          {/* 장소명 + 카테고리 */}
          <div className='flex flex-col items-start'>
            <p className='text-typo-sub-title text-brand-blue-700 truncate w-full'>{item.placeName}</p>
            {item.placeCategory && <p className='text-typo-description text-brand-gray-400'>{item.placeCategory}</p>}
          </div>

          {/* 방문 시간 입력 */}
          <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-[4px] flex items-center gap-[4px] h-[30px] pl-[8px] py-[5px]'>
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
          <textarea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder='메모를 입력하세요'
            rows={3}
            className='bg-brand-gray-100 border border-brand-gray-200 rounded-[4px] px-[12px] py-[8px] text-typo-base text-brand-gray-600 w-full outline-none resize-none placeholder:text-brand-gray-400 min-h-[70px]'
          />

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
              className='flex-1 flex items-center justify-center py-[8px] bg-brand-blue-700 rounded-[4px]'
            >
              <span className='text-typo-description font-semibold text-white'>저장</span>
            </button>
          </div>
        </div>

        {/* 복사/드래그 버튼 */}
        <div className='flex gap-[12px] items-center shrink-0 mt-[4px]'>
          <button aria-label='복사'>
            <Icon
              name='Copy'
              size={32}
              className='text-brand-gray-400'
            />
          </button>
          <button aria-label='순서 변경'>
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
