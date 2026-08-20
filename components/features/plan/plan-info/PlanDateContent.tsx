'use client';

import { Icon } from '@/components/common/Icon';
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
    <div className='flex flex-col gap-2 self-end mt-10'>
      <h4 className='text-typo-base text-brand-gray-600 mb-1'>여행 일정</h4>
      <div className='flex gap-2 mb-1'>
        <button
          type='button'
          onClick={() => onModeChange('date')}
          className={`rounded-sm px-2 py-2 text-typo-description border ${
            mode === 'date'
              ? 'bg-brand-gray-0 text-brand-blue-500 border-brand-blue-500 hover:bg-brand-blue-50'
              : 'bg-brand-gray-50 text-brand-gray-400 border-brand-gray-300 hover:bg-brand-gray-100'
          }`}
        >
          날짜선택
        </button>
        <button
          type='button'
          onClick={() => onModeChange('undecided')}
          className={`rounded-sm px-2 py-2 text-typo-description border ${
            mode === 'undecided'
              ? 'bg-brand-gray-0 text-brand-blue-500 border-brand-blue-500 hover:bg-brand-blue-50'
              : 'bg-brand-gray-50 text-brand-gray-400 border-brand-gray-300 hover:bg-brand-gray-100'
          }`}
        >
          일정미정
        </button>
      </div>

      {mode === 'date' ? (
        <>
          <div className='flex flex-row gap-2 items-center'>
            <FormTypeCalendar
              id='start_date'
              value={startDate}
              onChange={onStartDateChange}
              min={getToday()}
            />{' '}
            <Icon
              name='ArrowRightCirle'
              size={24}
              className='shrink-0'
            />
            <FormTypeCalendar
              id='end_date'
              value={endDate}
              onChange={onEndDateChange}
              min={startDate || getToday()}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className='flex flex-row items-center gap-2
        '
          >
            <FormTypeCount
              id='total_days'
              value={totalDays}
              onChange={onTotalDaysChange}
            />
            <p className='shrink-0 text-brand-gray-500'>일 일정</p>
          </div>
        </>
      )}
    </div>
  );
}
