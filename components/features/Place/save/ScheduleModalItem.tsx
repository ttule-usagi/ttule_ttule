'use client';

import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import { useGetPlanSchedules } from '@/hooks/plan/useGetPlanSchedules';
import type { PlanOverview } from '@/hooks/plan/useGetUserPlans';

interface PlanItemProps {
  plan: PlanOverview;
  selectedScheduleIds: Set<string>;
  onSelectSchedule: (scheduleId: string) => void;
}

export default function PlanItem({ plan, selectedScheduleIds, onSelectSchedule }: PlanItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: schedules, isLoading } = useGetPlanSchedules(isExpanded ? plan.id : null);

  function formatDateRange(departureDate: string | null, arrivalDate: string | null, isDateUndecided: boolean): string {
    if (isDateUndecided) return '날짜 미정';
    if (!departureDate || !arrivalDate) return '';
    const fmt = (d: string) => d.replace(/-/g, '.').slice(2); // "26.03.25" 형태

    const departYear = departureDate.slice(0, 4);
    const arriveYear = arrivalDate.slice(0, 4);

    if (departYear === arriveYear) return `${fmt(departureDate)} - ${fmt(arrivalDate).slice(3)}`; // "26.03.25 - 03.26"

    return `${fmt(departureDate)} - ${fmt(arrivalDate)}`; // "26.12.31 - 27.01.09"
  }

  const dateRange = formatDateRange(plan.departureDate, plan.arrivalDate, plan.isDateUndecided);

  return (
    <div className='bg-brand-gray-50 border border-brand-blue-50 rounded-sm flex flex-col gap-2 px-3 py-2'>
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className='flex gap-2 items-center justify-between w-full'
      >
        <div className='flex flex-col items-start flex-1 min-w-0'>
          <p className='text-typo-base text-brand-gray-700 truncate w-full text-left'>{plan.title}</p>
          <p className='text-typo-caption text-brand-gray-500'>{dateRange}</p>
        </div>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={24}
          className='text-brand-gray-500 shrink-0'
        />
      </button>

      {isExpanded && (
        <div className='flex flex-wrap gap-2'>
          {isLoading && <p className='text-typo-caption text-brand-gray-400'>로딩 중...</p>}
          {schedules?.map((schedule) => {
            const isSelected = selectedScheduleIds.has(schedule.id);
            return (
              <button
                key={schedule.id}
                onClick={() => onSelectSchedule(schedule.id)}
                className={`flex items-center justify-center px-3 py-1.5 rounded-sm border text-typo-description whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-blue-50 border-brand-blue-200 text-brand-blue-500'
                    : 'bg-white border-brand-gray-300 text-brand-gray-500'
                }`}
              >
                {isSelected && (
                  <Icon
                    name='Check'
                    size={18}
                    className='mr-1 text-brand-blue-500 shrink-0'
                  />
                )}
                {`${schedule.dayNumber}일차`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
