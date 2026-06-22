'use client';

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
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={handleDecrease}
          disabled={min !== undefined && value <= min}
          className='w-9 h-9 flex items-center justify-center rounded-lg border border-brand-gray-200
          bg-brand-gray-100 text-brand-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
        >
          −
        </button>
        <span
          id={id}
          className='w-10 text-center text-typo-base text-brand-gray-700'
        >
          {value}
        </span>
        <button
          type='button'
          onClick={handleIncrease}
          disabled={max !== undefined && value >= max}
          className='w-9 h-9 flex items-center justify-center rounded-lg border border-brand-gray-200
          bg-brand-gray-100 text-brand-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
        >
          +
        </button>
        {suffix && <span className='text-typo-base text-brand-gray-600'>{suffix}</span>}
      </div>
    </div>
  );
}
