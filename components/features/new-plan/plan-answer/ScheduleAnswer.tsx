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
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={() => onModeChange('date')}
          className={`rounded-full px-4 py-1.5 text-typo-sm border ${
            mode === 'date'
              ? 'bg-brand-blue-500 text-white border-brand-blue-500'
              : 'bg-white text-brand-gray-600 border-brand-gray-200'
          }`}
        >
          날짜선택
        </button>
        <button
          type='button'
          onClick={() => onModeChange('undecided')}
          className={`rounded-full px-4 py-1.5 text-typo-sm border ${
            mode === 'undecided'
              ? 'bg-brand-blue-500 text-white border-brand-blue-500'
              : 'bg-white text-brand-gray-600 border-brand-gray-200'
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
