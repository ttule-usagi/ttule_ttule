'use client';

import { NewPlaceFormInputProps } from '@/types/input';

// onChange는 값만 받아서 사용
interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
}

export default function FormTypeText({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  readOnly = false,
  required = false,
}: Props) {
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className='w-full max-h-11 rounded-lg border border-brand-gray-200 
        px-3 py-2 text-typo-base text-brand-gray-700 font-light bg-brand-gray-100 
        focus:outline-none focus:bg-brand-gray-0 focus:border-brand-blue-400 shadow-xs placeholder:text-login-placeholder'
      />
    </div>
  );
}
