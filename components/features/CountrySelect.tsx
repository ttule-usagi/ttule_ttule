'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/common/Icon';
import { COUNTRIES, type Country } from '@/lib/utils/countries';

interface Props {
  value: Country;
  onChange: (country: Country) => void;
}

export default function CountrySelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 닫기 + searchText 초기화
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 필터링
  const filteredOptions = searchText.trim()
    ? COUNTRIES.filter((country) => country.label.toLowerCase().includes(searchText.toLowerCase()))
    : COUNTRIES;

  // 옵션 선택
  const handleSelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchText('');
    setHighlightIndex(0);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 0) return;
      const selected = filteredOptions[highlightIndex] ?? filteredOptions[0];
      if (selected) {
        handleSelect(selected);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchText('');
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={ref}
      className='relative w-full'
    >
      {/* 검색 가능한 input */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className='grid w-full cursor-text grid-cols-1 rounded-full bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm'
      >
        <input
          ref={inputRef}
          type='text'
          value={isOpen ? searchText : value.label}
          onChange={(e) => {
            setSearchText(e.target.value);
            setHighlightIndex(0);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isOpen ? value.label : ''}
          className='col-start-1 row-start-1 bg-transparent outline-none pr-6 truncate'
        />
        <Icon
          className='absolute top-2 right-3 text-brand-gray-500 pointer-events-none'
          name='ChevronDown'
          size={20}
        />
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <ul className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-1 outline-black/5 sm:text-sm'>
          {filteredOptions.length === 0 ? (
            <li className='py-2 pl-3 text-brand-gray-400'>검색 결과가 없습니다</li>
          ) : (
            filteredOptions.map((nation, index) => (
              <li
                key={nation.countryCode}
                onClick={() => handleSelect(nation)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`relative cursor-default py-2 pr-9 pl-3 select-none ${
                  index === highlightIndex ? 'bg-brand-blue-50 text-brand-blue-700' : ''
                } ${value.countryCode === nation.countryCode ? 'font-semibold' : 'font-normal'}`}
              >
                {nation.label}
                {value.countryCode === nation.countryCode && (
                  <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <Icon
                      name='Check'
                      size={16}
                    />
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
