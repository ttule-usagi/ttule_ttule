'use client';

import type { PlaceCategory } from '@/hooks/new-place/useAddNewPlaceForm';

const CATEGORY_OPTIONS: PlaceCategory[] = [
  'airport',
  'restaurant',
  'atm',
  'shopping',
  'cafe',
  'hotel',
  'convenience',
  'etc',
  'terminal',
  'culture',
  'leisure',
  'nature',
  'sports',
  'medical',
  'education',
  'traffic',
  'gas_station',
  'parking',
  'landmark',
];

interface Props {
  koreanName: string;
  originalName: string;
  category: PlaceCategory;
  koreanNameError?: string;
  onKoreanNameChange: (v: string) => void;
  onOriginalNameChange: (v: string) => void;
  onCategoryChange: (v: PlaceCategory) => void;
}

export function PlaceManualFields({
  koreanName,
  originalName,
  category,
  koreanNameError,
  onKoreanNameChange,
  onOriginalNameChange,
  onCategoryChange,
}: Props) {
  return (
    <div className='space-y-4'>
      <p className='text-xs font-medium text-muted uppercase tracking-widest'>직접 입력</p>

      <div className='space-y-1'>
        <label className='block text-sm font-medium text-secondary'>
          한국어 이름 <span className='text-danger'>*</span>
        </label>
        <input
          type='text'
          value={koreanName}
          onChange={(e) => onKoreanNameChange(e.target.value)}
          placeholder='에펠탑'
          className='w-full border-b border-brand-gray-300'
        />
        {koreanNameError && <p className='text-xs text-danger mt-1'>{koreanNameError}</p>}
      </div>

      <div className='space-y-1'>
        <label className='block text-sm font-medium text-secondary'>
          현지어 이름 <span className='text-muted text-xs'>(선택)</span>
        </label>
        <input
          type='text'
          value={originalName}
          onChange={(e) => onOriginalNameChange(e.target.value)}
          placeholder='Tour Eiffel'
          className='w-full border-b border-brand-gray-300'
        />
      </div>

      <div className='space-y-1'>
        <label className='block text-sm font-medium text-secondary'>카테고리</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as PlaceCategory)}
          className='w-full bg-brand-gray-100 p-2 rounded-lg'
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option
              key={opt}
              value={opt}
            >
              {opt}
            </option>
          ))}
        </select>
        <p className='text-xs text-muted'>자동 매핑된 값 — 틀리면 여기서 수정하세요.</p>
      </div>
    </div>
  );
}
