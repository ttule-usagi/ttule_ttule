'use client';

import { PlaceListOverview } from '@/types/placeList';
import Link from 'next/link';
import PlaceListDropdownMenu from './PlaceListDropdwonMenu';
import { Icon } from '@/components/common/Icon';

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
          <span className='flex gap-1 items-center'>
            {place.isPublic ? (
              <>
                <Icon
                  name='Globe'
                  size={14}
                />
                공개됨
              </>
            ) : (
              <>
                <Icon
                  name='Lock'
                  size={14}
                />
                비공개
              </>
            )}
          </span>
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
        <PlaceListDropdownMenu
          id={place.id}
          listName={place.title}
          myRole={place.myRole}
        />
      </div>
    </Link>
  );
}
