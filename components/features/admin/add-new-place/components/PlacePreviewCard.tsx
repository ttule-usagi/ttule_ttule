'use client';

import type { PlaceCategory, PlaceSearchResult } from '@/hooks/new-place/useAddNewPlaceForm';

interface Props {
  place: PlaceSearchResult;
  mappedCategory: PlaceCategory;
}

const rows: { label: string; key: keyof PlaceSearchResult | 'mappedCategory' }[] = [
  { label: 'google_place_id', key: 'google_place_id' },
  { label: 'english_name', key: 'english_name' },
  { label: 'address', key: 'formatted_address' },
  { label: 'latitude / longitude', key: 'latitude' },
  { label: 'primaryType → category', key: 'mappedCategory' },
];

export function PlacePreviewCard({ place, mappedCategory }: Props) {
  return (
    <div className='rounded-xl border border-default bg-surface-1 px-5 py-4 space-y-2'>
      <p className='text-xs font-medium text-muted uppercase tracking-widest mb-3'>자동 완성된 정보</p>

      {rows.map(({ label, key }) => {
        let value: string;
        if (key === 'mappedCategory') {
          value = mappedCategory;
        } else if (key === 'latitude') {
          value = `${place.latitude.toFixed(6)}, ${place.longitude.toFixed(6)}`;
        } else {
          value = String(place[key] ?? '—');
        }

        return (
          <div
            key={label}
            className='flex justify-between items-start gap-4 py-1.5 border-b border-default last:border-b-0'
          >
            <span className='text-xs text-muted shrink-0'>{label}</span>
            <span className='text-xs text-primary font-medium text-right break-all'>
              {key === 'mappedCategory' ? (
                <>
                  <span className='text-muted mr-1'>{place.primary_type || 'none'} →</span>
                  <span className='text-accent'>{mappedCategory}</span>
                </>
              ) : (
                value
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
