'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '../common/Icon';
import { COUNTRIES } from '@/lib/utils/countries';

interface Props {
  onClick: () => void;
}

export default function CountrySelect() {
  // ✅ 타입 명시
  const [selected, setSelected] = useState<(typeof COUNTRIES)[number]>(COUNTRIES[3]);
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

  console.log('setSelected: ', selected);

  return (
    <div
      ref={ref}
      className='relative w-full'
    >
      {/* 버튼 */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm'
      >
        <span className='col-start-1 row-start-1 flex items-center gap-3 pr-6'>
          <span className='block truncate'>{selected.label}</span>
        </span>
        <Icon
          className='absolute top-2 right-3 text-brand-gray-500'
          name='ChevronDown'
          size={20}
        />
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <ul className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-1 outline-black/5 sm:text-sm'>
          {COUNTRIES.map((nation) => (
            <li
              key={nation.countryCode}
              onClick={() => {
                setSelected(nation);
                setIsOpen(false);
              }}
              className={`relative cursor-default py-2 pr-9 pl-3 select-none hover:bg-indigo-600 hover:text-white ${
                selected.countryCode === nation.countryCode ? 'font-semibold' : 'font-normal'
              }`}
            >
              {nation.label}
              {selected.countryCode === nation.countryCode && (
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
  );
}
