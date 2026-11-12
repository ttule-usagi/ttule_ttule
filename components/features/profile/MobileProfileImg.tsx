'use client';

import Image from 'next/image';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import ProfileImage from '@/components/features/ProfileImage';

export default function MobileProfileImg() {
  return (
    <div className='block md:absolute md:bottom-5.5'>
      <QueryBoundary
        errorFallback={() => (
          <div className='inline-block w-10 h-10 md:w-12 md:h-12 rounded-full'>
            <Image
              src={'/images/profile-blank-tomato.webp'}
              alt='placeholder-image'
              width={48}
              height={48}
              className='w-full h-full rounded-full object-cover'
            />
          </div>
        )}
      >
        <ProfileImage />
      </QueryBoundary>
    </div>
  );
}
