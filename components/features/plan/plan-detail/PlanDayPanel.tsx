'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { PlanSchedule, PlanItem } from '@/types/plan';
import { Icon } from '@/components/common/Icon';
import PlanItemCard from './PlanItemCard';
import PlanItemEditCard from './PlanItemEditCard';
import TransitInfo from './TransitInfo';
import Image from 'next/image';
import DropDown from '@/components/common/Dropdown';
import PlanMemoItemCard from './PlanMemoItemCard';
import PlanMemoItemEditCard from './PlanMemoItemEditCard';
import { usePlanSearchStore } from '@/lib/store/planSearchStore';
import { usePlanPlaceListStore } from '@/lib/store/planPlaceListStore';

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
  const [isNewMemoOpen, setIsNewMemoOpen] = useState(false);

  const dateStr = formatScheduleDate(schedule.scheduleDate, schedule.dayNumber);

  const handlePrefetchNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
  };

  const { triggerFocus } = usePlanSearchStore();
  const { triggerOpenPlaceList } = usePlanPlaceListStore();

  return (
    <div className='relative h-full w-full max-w-118'>
      {/* 이전 화살표 */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className='absolute -left-5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center'
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
          className='absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center'
          aria-label='다음 일차'
        >
          <Icon
            name='PageRight'
            size={42}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 안쪽 파란 패널 — 이 블록 안에서 모든 레이아웃 흐름을 제어합니다 */}

      <div className='absolute top-0 bottom-0 left-8 right-8 bg-line-pattern-blue rounded-lg shadow-xl flex flex-col overflow-hidden'>
        {/* 우표장식 (배경 느낌으로 absolute 띄움) */}
        <div className='absolute -top-[11px] right-7 pointer-events-none z-0'>
          <Image
            src='/images/poststamp.svg'
            alt='우표장식'
            width={190}
            height={100}
            style={{ width: 'auto' }}
          />
        </div>

        {/* 1. 패널 헤더 (고정 영역) */}
        <div className='flex-none flex items-start justify-between mt-6 mx-5 z-10'>
          <div className='flex flex-col items-start'>
            <p className='text-white font-semibold text-typo-title leading-8 tracking-[-0.72px]'>
              {schedule.dayNumber}일차
            </p>
            {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
          </div>

          {/* 편집/더보기 버튼 */}
          <div className='flex gap-3 items-center'>
            <button className='text-white text-typo-base'>편집</button>
            <Icon
              name='DotsHorizontal'
              size={32}
              className='text-white'
            />
          </div>
        </div>

        {/* 2. 아이템 목록 (스크롤 영역) */}
        {/* flex-1 min-h-0을 부모인 파란 패널이 직접 통제하도록 만들었습니다 */}
        <div className='flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-1 mt-6 px-4 pb-2 z-10'>
          {isFetching ? (
            <div className='flex flex-col gap-2'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='w-full h-30 shrink-0 rounded-2 animate-skeleton mb-2'
                />
              ))}
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className='flex flex-col gap-1 shrink-0'
                >
                  {item.type === 'memo' ? (
                    editingItemId === item.id ? (
                      <PlanMemoItemEditCard
                        item={item}
                        isNew={false}
                        scheduleId={schedule.id}
                        onClose={() => setEditingItemId(null)}
                        onSave={() => setEditingItemId(null)}
                      />
                    ) : (
                      <PlanMemoItemCard
                        item={item}
                        onClick={() => setEditingItemId(item.id)}
                      />
                    )
                  ) : editingItemId === item.id ? (
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

              {isNewMemoOpen && (
                <PlanMemoItemEditCard
                  isNew={true}
                  scheduleId={schedule.id}
                  onClose={() => setIsNewMemoOpen(false)}
                  onSave={() => {}}
                />
              )}
            </>
          )}
          {/* 3. 장소 추가 버튼 */}
          <div className=' z-10'>
            <DropDown>
              <DropDown.Trigger>
                <div className='flex items-center justify-center cursor-pointer hover:bg-brand-blue-900/20 hover:backdrop-blur-sm transition-colors duration-200 ease-in-out'>
                  <Image
                    src='/images/new-plan-item.svg'
                    alt='장소 추가'
                    width={375}
                    height={87}
                    style={{ width: 'auto' }}
                    loading='eager'
                  />
                </div>
              </DropDown.Trigger>

              <DropDown.Menu>
                <DropDown.Item onClick={triggerOpenPlaceList}>리스트에서 장소 가져오기</DropDown.Item>
                <DropDown.Item onClick={triggerFocus}>검색에서 장소 가져오기</DropDown.Item>
                <DropDown.Item onClick={() => setIsNewMemoOpen(true)}>장소 없는 일정 만들기</DropDown.Item>
              </DropDown.Menu>
            </DropDown>
          </div>
        </div>
      </div>
    </div>
  );
}
