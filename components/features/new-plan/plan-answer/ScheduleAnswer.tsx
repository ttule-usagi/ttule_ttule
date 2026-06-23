'use client';

import AnswerBubble from './AnswerBubble';
import FormTypeCalendar from '@/components/features/new-plan/plan-answer/form-inputs/FormTypeCalendar';
import FormTypeCount from '@/components/features/new-plan/plan-answer/form-inputs/FormTypeCount';
import NextStepButton from './NextStepButton';

type ScheduleMode = 'date' | 'undecided';

interface Props {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  totalDays: number;
  onTotalDaysChange: (value: number) => void;
  onNext: () => void;
}

export default function ScheduleAnswer({
  mode,
  onModeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  totalDays,
  onTotalDaysChange,
  onNext,
}: Props) {
  const isValid = mode === 'date' ? Boolean(startDate && endDate) : totalDays > 0;

  return (
    <div className='flex flex-col gap-2 w-full max-w-[286px] self-end'>
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

      <AnswerBubble>
        {mode === 'date' ? (
          <>
            <FormTypeCalendar
              id='start_date'
              label='출발날짜'
              value={startDate}
              onChange={onStartDateChange}
            />
            <FormTypeCalendar
              id='end_date'
              label='도착날짜'
              value={endDate}
              onChange={onEndDateChange}
              min={startDate}
            />
          </>
        ) : (
          <>
            <AnswerBubble.Text>날짜는 미정이나</AnswerBubble.Text>
            <FormTypeCount
              id='total_days'
              value={totalDays}
              onChange={onTotalDaysChange}
              suffix='일 동안'
            />
            <AnswerBubble.Text>여행 예정이에요.</AnswerBubble.Text>
          </>
        )}
        <AnswerBubble.Action>
          <NextStepButton
            onClick={onNext}
            disabled={isValid === false}
          />
        </AnswerBubble.Action>
      </AnswerBubble>
    </div>
  );
}
