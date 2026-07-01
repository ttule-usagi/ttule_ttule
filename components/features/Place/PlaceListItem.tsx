'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { PlaceListOverview } from '@/types/placeList';
import Link from 'next/link';
import PlaceListDropdownMenu from './PlaceListDropdwonMenu';

export default function PlaceListItem({ place }: { place: PlaceListOverview }) {
  return (
    <Link
      href={`/places/${place.id}`}
      className='w-full flex justify-center wobbly-box'
    >
      <div className='w-full flex flex-col gap-1'>
        <div className='flex items-center h-full text-brand-blue-700'>
          {place.icon && <span className='font-mona12 text-emoji-title mr-2'>{place.icon}</span>}
          <span className='text-typo-sub-title font-medium flex-1'>{place.title}</span>
        </div>

        <div className='flex gap-2 justify-baseline items-center text-typo-description font-light text-brand-gray-400'>
          <span>{place.isPublic ? '공유 목록' : '비공개'}</span>
          <span>장소 {place.placeCount}개</span>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className='text-brand-blue-700'
      >
        <PlaceListDropdownMenu id={place.id} />
      </div>
    </Link>
  );
}
