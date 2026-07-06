'use client';

import { PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';

interface PlanItemCardProps {
  item: PlanItem;
  onClick: () => void;
}

// 카테고리별 색상
const CATEGORY_COLORS: Record<string, string> = {
  음식점: '#FFCFA5',
  전철: '#A5BAFF',
  숙박시설: '#D6EF31',
  관광지: '#A5D8FF',
  카페: '#FFD6A5',
  쇼핑: '#C5A5FF',
};

function CategoryIcon({ category }: { category: string | null }) {
  const color = category ? (CATEGORY_COLORS[category] ?? '#C0C8E0') : '#C0C8E0';
  return (
    <div
      className='flex items-center justify-center rounded-full size-[26px] shrink-0'
      style={{ backgroundColor: color }}
    >
      {/* 카테고리 아이콘 — 추후 category별 Icon으로 교체 */}
      <div className='size-[15px] rounded-sm bg-white/40' />
    </div>
  );
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5); // "HH:MM"
}

export default function PlanItemCard({ item, onClick }: PlanItemCardProps) {
  return (
    <div
      className='relative bg-white rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] overflow-hidden cursor-pointer'
      onClick={onClick}
    >
      {/* 왼쪽 색상 바 (카테고리 색상) */}
      <div
        className='absolute left-0 top-0 bottom-0 w-[8px]'
        style={{
          backgroundColor: item.placeCategory ? (CATEGORY_COLORS[item.placeCategory] ?? '#C0C8E0') : '#C0C8E0',
        }}
      />

      <div className='pl-[15px] pr-[16px] py-[17px] flex gap-[8px] items-start'>
        {/* 카테고리 아이콘 + 방문 시간 */}
        <div className='flex flex-col gap-[2px] items-center w-[27px] shrink-0 mt-[4px]'>
          <CategoryIcon category={item.placeCategory} />
          {item.visitTime && (
            <p className='text-typo-caption text-brand-gray-400 whitespace-nowrap'>{formatVisitTime(item.visitTime)}</p>
          )}
        </div>

        {/* 장소 정보 */}
        <div className='flex flex-col gap-[8px] flex-1 min-w-0'>
          <div className='flex flex-col items-start'>
            <p className='text-typo-sub-title text-brand-blue-700 truncate w-full'>{item.placeName}</p>
            {item.placeCategory && <p className='text-typo-description text-brand-gray-400'>{item.placeCategory}</p>}
          </div>
          {item.memoContent && <p className='text-typo-base text-brand-gray-600 line-clamp-2'>{item.memoContent}</p>}
        </div>

        {/* 더보기 버튼 */}
        <button
          className='shrink-0 mt-[4px]'
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
    </div>
  );
}
