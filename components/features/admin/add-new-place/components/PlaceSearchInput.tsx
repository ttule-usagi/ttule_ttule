'use client';

import { useEffect, useRef, useState } from 'react';

import type { PlaceSearchResult } from '@/hooks/new-place/useAddNewPlaceForm';

interface SearchCandidate {
  google_place_id: string;
  english_name: string;
  formatted_address: string;
  primary_type: string;
  latitude: number;
  longitude: number;
}

interface Props {
  onSelect: (place: PlaceSearchResult) => void;
}

export function PlaceSearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim() || isComposingRef.current) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/google-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: value, languageCode: 'en' }),
        });
        const data = await res.json();
        const places: SearchCandidate[] = (data.places ?? []).map(
          (p: {
            id: string;
            displayName?: { text: string };
            formattedAddress?: string;
            primaryTypeDisplayName?: { text: string };
            primaryType?: string;
            location?: { latitude: number; longitude: number };
          }) => ({
            google_place_id: p.id,
            english_name: p.displayName?.text ?? '',
            formatted_address: p.formattedAddress ?? '',
            primary_type: p.primaryType ?? '',
            latitude: p.location?.latitude ?? 0,
            longitude: p.location?.longitude ?? 0,
          }),
        );
        setResults(places);
        setIsOpen(places.length > 0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }

  function handleSelect(place: SearchCandidate) {
    setQuery(place.english_name);
    setIsOpen(false);
    setResults([]);
    onSelect(place);
  }

  return (
    <div
      ref={wrapperRef}
      className='relative'
    >
      <label className='block text-sm font-medium text-secondary mb-1'>장소 검색</label>
      <div className='relative'>
        <input
          type='text'
          value={query}
          onChange={handleChange}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={(e) => {
            isComposingRef.current = false;
            handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
          placeholder='공항, 관광명소, 기차역 등 영문 또는 한글로 검색'
          className='w-full border-b border-brand-gray-300'
          autoComplete='off'
        />
        {isLoading && <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted'>검색 중...</span>}
      </div>

      {isOpen && results.length > 0 && (
        <ul className='absolute z-50 w-full mt-1 bg-surface-2 border border-default rounded-lg shadow-md overflow-hidden'>
          {results.map((place) => (
            <li
              key={place.google_place_id}
              onMouseDown={() => handleSelect(place)}
              className='px-4 py-3 cursor-pointer hover:bg-surface-1 border-b border-default last:border-b-0'
            >
              <p className='text-sm font-medium text-primary'>{place.english_name}</p>
              <p className='text-xs text-muted mt-0.5'>{place.formatted_address}</p>
              {place.primary_type && (
                <span className='inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded bg-surface-0 text-secondary'>
                  {place.primary_type}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
