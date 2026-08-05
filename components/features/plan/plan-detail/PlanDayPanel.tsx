'use client';

import { useDroppable } from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { Icon } from '@/components/common/Icon';
import { useGetPlanMyRole } from '@/hooks/plan/useGetPlanMyRole';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { PlanSchedule, PlanItem, PlanInfo } from '@/types/plan';

import PanelHeader from './panelitem/PanelHeader';
import { PlaceItems } from './panelitem/PlaceItems';

interface PlanDayPanelProps {
  plan: Pick<PlanInfo, 'title' | 'departureDate' | 'arrivalDate'>;
  planId: string;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  items: PlanItem[];
  isFetching: boolean;
  totalDays: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenPlaceDetail: (item: PlanItem) => void;
  hasSession: boolean;
}

export default function PlanDayPanel({
  plan,
  planId,
  schedule,
  schedules,
  totalDays,
  currentIndex,
  onPrev,
  onNext,
  items,
  isFetching,
  hasSession,
  onOpenPlaceDetail,
}: PlanDayPanelProps) {
  const queryClient = useQueryClient();

  const { data: myRole } = useGetPlanMyRole(planId);
  const { setNodeRef } = useDroppable({ id: schedule.id, data: { scheduleId: schedule.id } });

  const handlePrefetchNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
  };

  return (
    <div
      ref={setNodeRef}
      className='relative h-full w-full max-w-118'
    >
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
        <PanelHeader
          schedule={schedule}
          myRole={myRole}
          hasSession={hasSession}
        />

        {/* 2. 아이템 목록 (스크롤 영역) */}
        <PlaceItems
          plan={plan}
          planId={planId}
          schedule={schedule}
          schedules={schedules}
          items={items}
          isFetching={isFetching}
          myRole={myRole}
          hasSession={hasSession}
          onOpenPlaceDetail={onOpenPlaceDetail}
        />
      </div>
    </div>
  );
}
