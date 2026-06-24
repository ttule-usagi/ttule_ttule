'use client';

import { Icon } from '@/components/common/Icon';

interface Props {
  id: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string; // 예: '일 동안'
}

export default function FormTypeCount({ id, label, value, onChange, min = 1, max, step = 1, suffix }: Props) {
  const handleDecrease = () => {
    const next = value - step;
    if (min !== undefined && next < min) return;
    onChange(next);
  };

  const handleIncrease = () => {
    const next = value + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  return (
    <div className='flex flex-col gap-3 w-full'>
      {label && (
        <label
          htmlFor={id}
          className='text-typo-base text-brand-gray-600'
        >
          {label}
        </label>
      )}
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={handleDecrease}
          disabled={min !== undefined && value <= min}
          className='w-9 h-9 flex flex-1 items-center justify-center rounded-lg 
          bg-brand-blue-100 text-brand-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-brand-blue-50'
        >
          <Icon
            name='Minus'
            size={20}
          />
        </button>
        <div className='flex flex-1 items-center justify-center bg-brand-blue-50 text-brand-gray-600 rounded-lg h-9'>
          <span
            id={id}
            className='text-center text-typo-description'
          >
            {value}
          </span>
        </div>
        <button
          type='button'
          onClick={handleIncrease}
          disabled={max !== undefined && value >= max}
          className='w-9 h-9 flex flex-1 items-center justify-center rounded-lg 
          bg-brand-blue-100 text-brand-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-brand-blue-50'
        >
          <Icon
            name='Plus'
            size={20}
          />
        </button>
        {suffix && <span className='text-typo-base text-brand-blue-50'>{suffix}</span>}
      </div>
    </div>
  );
}
