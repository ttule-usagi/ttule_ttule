'use client';

import { Icon } from '@/components/common/Icon';
import type { PlanItem } from '@/types/plan';

interface PlanMemoItemCardProps {
  item: PlanItem;
  onClick: () => void;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanMemoItemCard({ item, onClick }: PlanMemoItemCardProps) {
  return (
    <div
      className='relative bg-white rounded-[8px] shadow-sm overflow-hidden cursor-pointer w-full'
      onClick={onClick}
    >
      {/* 왼쪽 방문 시간 */}
      {item.visitTime && (
        <p className='absolute left-[11px] top-[25px] text-typo-caption text-brand-gray-400 whitespace-nowrap'>
          {formatVisitTime(item.visitTime)}
        </p>
      )}

      <div className='pl-[51px] pr-[48px] py-[17px] flex flex-col gap-[8px]'>
        {/* 제목 */}
        <p className='text-typo-sub-title text-brand-blue-700 whitespace-nowrap'>{item.placeName}</p>

        {/* 메모 */}
        {item.memoContent && (
          <p className='text-typo-base text-brand-gray-500 whitespace-pre-line line-clamp-2'>{item.memoContent}</p>
        )}
      </div>

      {/* 더보기 버튼 */}
      <button
        className='absolute right-[8px] top-[17px]'
        onClick={(e) => {
          e.stopPropagation();
          // 더보기 메뉴 오픈 — 추후 구현
        }}
      >
        <Icon
          name='DotsHorizontal'
          size={32}
          className='text-brand-gray-400'
        />
      </button>
    </div>
  );
}
