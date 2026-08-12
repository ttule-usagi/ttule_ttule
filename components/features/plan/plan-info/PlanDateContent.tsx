'use client';

import { ScheduleMode } from '@/hooks/new-plan/useNewPlanForm';

import FormTypeCalendar from './FormTypeCalendar';
import FormTypeCount from './FormTypeCount';

interface Props {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  totalDays: number;
  onTotalDaysChange: (value: number) => void;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function PlanDateContent({
  mode,
  onModeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  totalDays,
  onTotalDaysChange,
}: Props) {
  return (
    <div className='flex flex-col gap-2 self-end'>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={() => onModeChange('date')}
          className={`rounded-lg px-2 py-2 text-typo-description border ${
            mode === 'date'
              ? 'bg-brand-gray-0 text-brand-blue-500 border-brand-blue-500'
              : 'bg-brand-gray-50 text-brand-gray-400 border-brand-gray-300'
          }`}
        >
          날짜선택
        </button>
        <button
          type='button'
          onClick={() => onModeChange('undecided')}
          className={`rounded-lg px-2 py-2 text-typo-description border ${
            mode === 'undecided'
              ? 'bg-brand-gray-0 text-brand-blue-500 border-brand-blue-500'
              : 'bg-brand-gray-100 text-brand-gray-400 border-brand-gray-300'
          }`}
        >
          일정미정
        </button>
      </div>

      {mode === 'date' ? (
        <>
          <FormTypeCalendar
            id='start_date'
            label='출발날짜'
            value={startDate}
            onChange={onStartDateChange}
            min={getToday()}
          />
          <FormTypeCalendar
            id='end_date'
            label='도착날짜'
            value={endDate}
            onChange={onEndDateChange}
            min={startDate || getToday()}
          />
        </>
      ) : (
        <>
          <FormTypeCount
            id='total_days'
            value={totalDays}
            onChange={onTotalDaysChange}
          />
          <p>여행 예정이에요.</p>
        </>
      )}
    </div>
  );
}
