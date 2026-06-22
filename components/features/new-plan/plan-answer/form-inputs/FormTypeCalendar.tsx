'use client';

interface Props {
  id: string;
  label: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
}

export default function FormTypeCalendar({ id, label, value, onChange, min, max, required = false }: Props) {
  return (
    <div className='flex flex-col gap-3 w-full'>
      <label
        htmlFor={id}
        className='text-typo-base text-brand-gray-600'
      >
        {label}
        {required && <span className='text-orange-500 ml-0.5'>*</span>}
      </label>
      <input
        id={id}
        type='date'
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className='w-full max-h-11 rounded-lg border border-brand-gray-200 
        px-3 py-2 text-typo-base text-brand-gray-700 font-light bg-brand-gray-100 
        focus:outline-none focus:bg-brand-gray-0 focus:border-brand-blue-400 shadow-xs'
      />
    </div>
  );
}
