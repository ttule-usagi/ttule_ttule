'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlanDayPanel from '@/components/features/plan/PlanDayPanel';

interface PlanDetailContainerProps {
  planId: string;
}

export default function PlanDetailContainer({ planId }: PlanDetailContainerProps) {
  const queryClient = useQueryClient();
  const { data } = useGetPlanDetail(planId);
  const { plan, schedules, members, items: firstScheduleItems } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSchedule = schedules[currentIndex];

  const handleNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    // 이전 일차는 이미 한번 조회했던 캐시가 남아있을 가능성이 높아서 prefetch 불필요
    setCurrentIndex((i) => i - 1);
  };

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {/* 지도 배경 영역 — 추후 GoogleMapJS or GoogleMapEmbed로 교체 */}
      <div className='absolute inset-0 bg-brand-blue-50' />

      {/* 오른쪽 일정 패널 */}
      <div className='absolute top-[90px] right-20 w-[408px] bottom-6'>
        <QueryBoundary>
          <div className='absolute top-0 right-[-32px] w-[472px] bottom-0'>
            <PlanDayPanel
              planId={planId}
              schedule={currentSchedule}
              initialItems={currentIndex === 0 ? firstScheduleItems : undefined}
              totalDays={schedules.length}
              currentIndex={currentIndex}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </QueryBoundary>
      </div>
    </div>
  );
}
