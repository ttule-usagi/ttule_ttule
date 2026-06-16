'use client';

import { useEffect, useRef, useState } from 'react';

export type AutoCompleteItem = {
  id: string;
  name: string;
};

export interface AutoCompleteProps {
  items: AutoCompleteItem[];
  onSelect: (item: AutoCompleteItem) => void;
  onClose: () => void;
}

const AutoComplete = ({ items, onSelect, onClose }: AutoCompleteProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 항목이 바뀔 때마다(검색어 변경 등) 활성 인덱스 초기화
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 키보드 탐색 (위/아래/엔터/ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
          // 한글 등 조합 중인 입력은 무시 (조합 완료 키 입력과 중복 방지)
          if (e.isComposing) return;
          if (activeIndex >= 0) {
            e.preventDefault();
            onSelect(items[activeIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, activeIndex, onSelect, onClose]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role='listbox'
      className='absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 p-0 m-0'
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type='button'
          // 클릭 시 input의 blur가 먼저 발생해 리스트가 닫히는 것을 방지
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(item)}
          role='option'
          aria-selected={index === activeIndex}
          className={`w-full text-left px-4 py-3 bg-transparent text-sm text-slate-900 cursor-pointer focus:outline-none ${
            index === activeIndex ? 'bg-slate-100' : ''
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default AutoComplete;
