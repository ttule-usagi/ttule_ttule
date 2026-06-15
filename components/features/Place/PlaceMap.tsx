'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function PlaceMap() {
  const { listId } = useParams();

  return (
    <div className='w-full h-full relative min-w-152'>
      {!listId ? (
        <>
          <Image
            src='/images/map.png'
            alt='장소 리스트 임의 지도'
            fill
            className='object-cover opacity-60'
          />
          <div className='text-typo-sub-title font-medium absolute inset-0 flex items-center justify-center bg-white/60 text-brand-gray-800'>
            장소 리스트를 선택하면 지도가 나타납니다.
          </div>
        </>
      ) : (
        <Image
          src={`/api/map/place-list?listId=${listId}`}
          alt='장소 리스트 지도'
          fill
          className='object-cover'
        />
      )}
    </div>
  );
}
