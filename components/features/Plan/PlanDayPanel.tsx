'use client';

import { useState } from 'react';
import { useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { PlanSchedule, PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';
import PlanItemCard from './PlanItemCard';
import PlanItemEditCard from './PlanItemEditCard';
import TransitInfo from './TransitInfo';

interface PlanDayPanelProps {
  planId: string;
  schedule: PlanSchedule;
  initialItems?: PlanItem[];
  totalDays: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

function formatScheduleDate(dateStr: string | null, dayNumber: number): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}.${day}(${weekday})`;
}

export default function PlanDayPanel({
  planId,
  schedule,
  totalDays,
  currentIndex,
  onPrev,
  onNext,
  initialItems,
}: PlanDayPanelProps) {
  const { data: items } = useGetScheduleItems(planId, schedule.id, initialItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const dateStr = formatScheduleDate(schedule.scheduleDate, schedule.dayNumber);

  return (
    <div className='relative h-full w-full'>
      {/* 이전 화살표 */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 size-[32px] flex items-center justify-center'
          aria-label='이전 일차'
        >
          <Icon
            name='PageLeft'
            size={20}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 다음 화살표 */}
      {currentIndex < totalDays - 1 && (
        <button
          onClick={onNext}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 size-[32px] flex items-center justify-center'
          aria-label='다음 일차'
        >
          <Icon
            name='PageRight'
            size={20}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 안쪽 파란 패널 — 화살표 너비만큼 좌우 여백 */}
      <div className='absolute top-0 left-[32px] right-[32px] bottom-0 bg-brand-blue-700 rounded-tl-[8px] shadow-xl overflow-hidden'>
        <div className='relative h-full w-full bg-brand-blue-700 rounded-tl-[8px] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] overflow-hidden'>
          {/* 패널 헤더 */}
          <div className='absolute top-[24px] left-[20px] flex flex-col items-start'>
            <p className='text-white font-semibold text-[24px] leading-[32px] tracking-[-0.72px]'>
              {schedule.dayNumber}일차
            </p>
            {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
          </div>

          {/* 편집/더보기 버튼 */}
          <div className='absolute top-[24px] right-[19px] flex gap-[12px] items-center'>
            <button className='text-white text-typo-base'>편집</button>
            <Icon
              name='DotsHorizontal'
              size={32}
              className='text-white'
            />
          </div>

          {/* 아이템 목록 */}
          <div className='absolute top-[108px] left-[16px] right-[16px] bottom-[16px] overflow-y-auto flex flex-col gap-[8px]'>
            {items.map((item, index) => (
              <div
                key={item.id}
                className='flex flex-col gap-[8px]'
              >
                {editingItemId === item.id ? (
                  <PlanItemEditCard
                    item={item}
                    onClose={() => setEditingItemId(null)}
                    onSave={() => setEditingItemId(null)}
                  />
                ) : (
                  <PlanItemCard
                    item={item}
                    onClick={() => setEditingItemId(item.id)}
                  />
                )}

                {/* 이동 수단 정보 (마지막 아이템 제외) */}
                {index < items.length - 1 && item.transitMode && (
                  <TransitInfo
                    mode={item.transitMode}
                    time={item.transitTime}
                    hasMemo={!!item.transitMemo}
                  />
                )}
              </div>
            ))}

            {/* 장소 추가 버튼 */}
            <div className='flex items-center justify-center h-[87px]'>
              <button
                className='flex items-center justify-center size-[36px] rounded-full bg-brand-blue-50/20 border border-white/30'
                aria-label='장소 추가'
              >
                <Icon
                  name='Plus'
                  size={24}
                  className='text-white'
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
