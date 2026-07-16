'use client';

import DropDown from '@/components/common/Dropdown';
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
    <div className='flex bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer w-full gap-2 px-4'>
      {/* 왼쪽 방문 시간 */}
      {item.visitTime && (
        <p className='absolute left-3 top-6 text-typo-caption text-brand-gray-400 whitespace-nowrap'>
          {formatVisitTime(item.visitTime)}
        </p>
      )}

      <div className='flex-1 pl-13 pr-12 py-4 flex flex-col gap-2'>
        {/* 제목 */}
        <p className='text-typo-sub-title text-brand-blue-700 whitespace-nowrap'>{item.placeName}</p>

        {/* 메모 */}
        {item.memoContent && (
          <p className='text-typo-base text-brand-gray-500 whitespace-pre-line line-clamp-2'>{item.memoContent}</p>
        )}
      </div>

      {/* 더보기 버튼 */}
      <DropDown>
        {/* 트리거는 드롭다운 메뉴를 열고 닫을 버튼이 되는 것 */}
        <DropDown.Trigger>
          <Icon
            name='DotsHorizontal'
            size={24}
            className='text-brand-gray-400'
          />
        </DropDown.Trigger>

        {/* 실제로 열릴 드롭다운 메뉴 */}
        <DropDown.Menu>
          {/* 아이템 하나가 버튼 하나고, 여기 이벤트를 연결해주면 된다 */}
          <DropDown.Item>일정 삭제</DropDown.Item>
          <DropDown.Item>일정 복제</DropDown.Item>
          <DropDown.Item onClick={onClick}>일정 편집</DropDown.Item>
          <DropDown.Item>다른 날짜로 변경</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
