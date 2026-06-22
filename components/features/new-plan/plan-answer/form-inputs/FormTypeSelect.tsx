'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/common/Icon';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectOptionGroup {
  groupLabel: string;
  options: SelectOption[];
}

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  groups: SelectOptionGroup[];
  required?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FormTypeSelect({
  id,
  label,
  placeholder = '검색해주세요',
  value,
  onChange,
  groups,
  required = false,
  onOpenChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const flatOptions = groups.flatMap((g) => g.options);
  const selectedOption = flatOptions.find((o) => o.value === value);

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleOpenChange(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGroups = searchText.trim()
    ? groups
        .map((group) => ({
          ...group,
          options: group.options.filter(
            (option) =>
              option.label.toLowerCase().includes(searchText.toLowerCase()) ||
              group.groupLabel.toLowerCase().includes(searchText.toLowerCase()),
          ),
        }))
        .filter((group) => group.options.length > 0)
    : groups;

  const filteredFlatOptions = filteredGroups.flatMap((g) => g.options);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    handleOpenChange(false);
    setSearchText('');
    setHighlightIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        handleOpenChange(true);
        return;
      }
      setHighlightIndex((i) => Math.min(i + 1, filteredFlatOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      if (filteredFlatOptions.length === 0) return;
      const selected = filteredFlatOptions[highlightIndex] ?? filteredFlatOptions[0];
      if (selected) handleSelect(selected);
    } else if (e.key === 'Escape') {
      handleOpenChange(false);
      setSearchText('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className='flex flex-col gap-3 w-full'>
      {label && (
        <label
          htmlFor={id}
          className='text-typo-base text-brand-gray-600'
        >
          {label}
          {required && <span className='text-orange-500 ml-0.5'>*</span>}
        </label>
      )}

      <div
        ref={ref}
        className='relative w-full'
      >
        <div
          onClick={() => {
            handleOpenChange(true);
            inputRef.current?.focus();
          }}
          className='grid w-full cursor-text grid-cols-1 rounded-full bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm'
        >
          <input
            ref={inputRef}
            id={id}
            type='text'
            value={isOpen ? searchText : (selectedOption?.label ?? '')}
            onChange={(e) => {
              setSearchText(e.target.value);
              setHighlightIndex(0);
              if (!isOpen) handleOpenChange(true);
            }}
            onFocus={() => handleOpenChange(true)}
            onKeyDown={handleKeyDown}
            placeholder={isOpen ? (selectedOption?.label ?? placeholder) : placeholder}
            className='col-start-1 row-start-1 bg-transparent outline-none pr-6 truncate'
          />
          <Icon
            className='absolute top-2 right-3 text-brand-gray-500 pointer-events-none'
            name='ChevronDown'
            size={20}
          />
        </div>

        {isOpen && (
          <ul className='absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-1 outline-black/5 sm:text-sm'>
            {filteredFlatOptions.length === 0 ? (
              <li className='py-2 pl-3 text-brand-gray-400'>검색 결과가 없습니다</li>
            ) : (
              filteredGroups.map((group) => (
                <li key={group.groupLabel}>
                  <p className='px-3 pt-2 pb-1 text-typo-caption font-medium text-brand-gray-400'>{group.groupLabel}</p>
                  <ul>
                    {group.options.map((option) => {
                      const flatIndex = filteredFlatOptions.findIndex((o) => o.value === option.value);
                      return (
                        <li
                          key={option.value}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() => setHighlightIndex(flatIndex)}
                          className={`relative cursor-default py-2 pr-9 pl-3 select-none ${
                            flatIndex === highlightIndex ? 'bg-brand-blue-50 text-brand-blue-700' : ''
                          } ${option.value === value ? 'font-semibold' : 'font-normal'}`}
                        >
                          {option.label}
                          {option.value === value && (
                            <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                              <Icon
                                name='Check'
                                size={16}
                              />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
