'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/common/Icon';

interface Option {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  placeholder?: string;
  required?: boolean;
}

export default function FormTypeSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  required = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 현재 선택된 옵션 찾기 (label 표시용)
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className='flex flex-col gap-3 w-full '>
      <label
        htmlFor={id}
        className='text-typo-base text-login-label font-light'
      >
        {label}
        {required && <span className='text-orange-500 ml-0.5'>*</span>}
      </label>

      <div
        ref={ref}
        className='relative w-full'
      >
        {/* 트리거 버튼 */}
        <button
          id={id}
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='grid w-full cursor-pointer grid-cols-1 rounded-lg bg-white py-2.5 pr-2 pl-3.5 text-left outline outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 text-typo-base font-light'
        >
          <span className='col-start-1 row-start-1 flex items-center gap-3 pr-6'>
            <span className={`block truncate ${selectedOption ? 'text-brand-gray-900' : 'text-login-placeholder'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <Icon
            className='absolute top-2.5 right-3 text-brand-gray-500'
            name='ChevronDown'
            size={20}
          />
        </button>

        {/* 드롭다운 */}
        {isOpen && (
          <ul className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-1 outline-black/5 sm:text-sm'>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`relative cursor-default py-2 pr-9 pl-3 select-none hover:bg-brand-blue-50 hover:text-brand-blue-700 ${
                  value === option.value ? 'font-semibold' : 'font-normal'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <Icon
                      name='Check'
                      size={16}
                    />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
