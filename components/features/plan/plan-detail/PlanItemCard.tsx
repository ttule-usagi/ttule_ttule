'use client';

import { PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/utils/placeCategory';
import type { PlaceCategory } from '@/types/CorePlace';
import DropDown from '@/components/common/Dropdown';

interface PlanItemCardProps {
  item: PlanItem;
  onClick: () => void;
}

function CategoryIcon({ category }: { category: string | null }) {
  const color = category ? (CATEGORY_COLORS[category as PlaceCategory] ?? '#C0C8E0') : '#C0C8E0';
  const emoji = category ? (CATEGORY_EMOJI[category as PlaceCategory] ?? '📍') : '📍';

  return (
    <div
      className='flex items-center justify-center rounded-full size-[26px] shrink-0'
      style={{ backgroundColor: color }}
    >
      <span className='font-mona12 text-emoji-sm pl-0.5 pb-0.5'>{emoji}</span>
    </div>
  );
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5); // "HH:MM"
}

export default function PlanItemCard({ item, onClick }: PlanItemCardProps) {
  const categoryLabel = item.placeCategory ? getPlaceCategoryLabel(item.placeCategory) : null;

  return (
    <div className='relative bg-white rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] overflow-hidden cursor-pointer'>
      {/* 왼쪽 색상 바 (카테고리 색상) */}
      {/* <div
        className='absolute left-0 top-0 bottom-0 w-[8px]'
        style={{
          backgroundColor: item.placeCategory
            ? (CATEGORY_COLORS[item.placeCategory as PlaceCategory] ?? '#C0C8E0')
            : '#C0C8E0',
        }}
      /> */}

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
            {categoryLabel && <p className='text-typo-description text-brand-gray-400'>{categoryLabel}</p>}
          </div>
          {item.memoContent && <p className='text-typo-base text-brand-gray-600 line-clamp-2'>{item.memoContent}</p>}
        </div>

        {/* 더보기 버튼 */}

        <DropDown>
          {/* 트리거는 드롭다운 메뉴를 열고 닫을 버튼이 되는 것 */}
          <DropDown.Trigger>
            <Icon
              name='DotsHorizontal'
              size={24}
              className='mt-3 text-brand-gray-400'
            />
          </DropDown.Trigger>

          {/* 실제로 열릴 드롭다운 메뉴 */}
          <DropDown.Menu>
            {/* 아이템 하나가 버튼 하나고, 여기 이벤트를 연결해주면 된다 */}
            <DropDown.Item>일정 삭제</DropDown.Item>
            <DropDown.Item>일정 복제</DropDown.Item>
            <DropDown.Item onClick={onClick}>일정 편집</DropDown.Item>
            <DropDown.Item>구글 지도에서 보기</DropDown.Item>
            <DropDown.Item>다른 날짜로 변경</DropDown.Item>
          </DropDown.Menu>
        </DropDown>
      </div>
    </div>
  );
}
