'use client';

import { useMemo } from 'react';

import { Icon } from '@/components/common/Icon';
import { EditablePlace, EditablePlaceParams, Tag } from '@/types/placeList';

import PlaceTag from '../tag/PlaceTag';

interface EditPlaceProps {
  place: EditablePlace;
  onMemoChange: ({ id, memoContent }: Omit<EditablePlaceParams, 'tagIds'>) => void;
  onDeletePlace: (placeName: string, placeId: string) => void;
  listTags: Tag[];
  onToggleTag: (placeId: string, tagId: string) => void;
}

export default function EditPlace({ place, onMemoChange, onDeletePlace, listTags, onToggleTag }: EditPlaceProps) {
  const selectedIds = useMemo(() => new Set(place.tagIds), [place.tagIds]);

  return (
    <div className='flex flex-col w-full border border-brand-gray-300 rounded-sm p-3 gap-2.5'>
      <div className='flex justify-between items-center'>
        <p className='flex-1 text-typo-base text-brand-gray-600'>{place.customName}</p>
        <Icon
          name='XClose'
          size={26}
          className='cursor-pointer text-brand-gray-400 mr-0.5 rounded-full hover:bg-brand-gray-100 hover:text-brand-blue-700'
          onClick={() => onDeletePlace(place.customName, place.id)}
        />
      </div>

      <textarea
        placeholder='메모 추가'
        value={place.memoContent ?? ''}
        className='bg-brand-gray-100 min-h-16 text-typo-base px-3 py-2 text-brand-gray-600 border border-brand-gray-200 outline-none rounded-sm w-full field-sizing-content resize-none hover:bg-brand-gray-200'
        onChange={(e) => onMemoChange({ id: place.id, memoContent: e.target.value })}
      />

      {/* 태그 */}
      <div className='flex gap-1 items-center overflow flex-wrap'>
        {listTags.map((item) => (
          <PlaceTag
            key={item.id}
            tag={item}
            isEdit={true}
            isSelected={selectedIds.has(item.id)}
            onClick={() => onToggleTag(place.id, item.id)}
          />
        ))}
      </div>
    </div>
  );
}
