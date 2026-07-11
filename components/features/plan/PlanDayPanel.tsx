'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleItemsQueryOptions, useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { PlanSchedule, PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';
import PlanItemCard from './PlanItemCard';
import PlanItemEditCard from './PlanItemEditCard';
import TransitInfo from './TransitInfo';
import Image from 'next/image';
import lobbyPlan from '@/images/lobby-plan.svg';

interface PlanDayPanelProps {
  planId: string;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  items: PlanItem[];
  isFetching: boolean;
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
  schedules,
  totalDays,
  currentIndex,
  onPrev,
  onNext,
  items,
  isFetching,
}: PlanDayPanelProps) {
  const queryClient = useQueryClient();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const dateStr = formatScheduleDate(schedule.scheduleDate, schedule.dayNumber);

  const handlePrefetchNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
  };

  return (
    <div className='relative h-full w-full max-w-[472px]'>
      {/* 이전 화살표 */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className='absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 size-[32px] flex items-center justify-center'
          aria-label='이전 일차'
        >
          <Icon
            name='PageLeft'
            size={42}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 다음 화살표 */}
      {currentIndex < totalDays - 1 && (
        <button
          onClick={onNext}
          onMouseEnter={handlePrefetchNext}
          onFocus={handlePrefetchNext}
          className='absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 size-[32px] flex items-center justify-center'
          aria-label='다음 일차'
        >
          <Icon
            name='PageRight'
            size={42}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 안쪽 파란 패널 — 화살표 너비만큼 좌우 여백 */}
      <div className='absolute top-0 left-8 right-8 bottom-0 bg-line-pattern-blue rounded-lg shadow-xl overflow-hidden'>
        <div className='relative h-full w-full bg-line-pattern-blue rounded-tl-2 shadow-lg overflow-hidden'>
          <div className='absolute top-[-11px] right-7'>
            <Image
              src='/images/poststamp.svg'
              alt='우표장식'
              width={190}
              height={100}
              style={{ width: 'auto' }}
            />
          </div>
          {/* 패널 헤더 */}
          <div className='absolute top-6 left-5 flex flex-col items-start'>
            <p className='text-white font-semibold text-typo-title leading-8 tracking-[-0.72px]'>
              {schedule.dayNumber}일차
            </p>
            {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
          </div>

          {/* 편집/더보기 버튼 */}
          <div className='absolute top-6 right-5 flex gap-3 items-center'>
            <button className='text-white text-typo-base'>편집</button>
            <Icon
              name='DotsHorizontal'
              size={32}
              className='text-white'
            />
          </div>

          {/* 아이템 목록 */}
          <div className='absolute top-27 left-4 right-4 bottom-4 overflow-y-auto flex flex-col gap-[8px]'>
            {isFetching ? (
              <div className='flex-1 flex-col gap-2'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='w-full h-30 rounded-2 animate-skeleton mb-2'
                  />
                ))}
              </div>
            ) : (
              <>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className='flex flex-col gap-2'
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
                <div className='flex items-center justify-center h-22'>
                  <button className='flex items-center justify-center cursor-pointer hover:bg-brand-blue-900/20 hover:backdrop-blur-sm  transition-colors duration-200 ease-in-out'>
                    <Image
                      src='/images/new-plan-item.svg'
                      alt='장소 추가'
                      width={375}
                      height={87}
                      style={{ width: 'auto' }}
                      loading='eager'
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
