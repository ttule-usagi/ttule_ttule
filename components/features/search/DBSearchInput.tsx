'use client';

import { Icon } from '@/components/common/Icon';
import { usePathname, useRouter } from 'next/navigation';

export default function DBSearchInput() {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className='flex gap-4 items-center mb-8'>
      {path !== '/places' && (
        <Icon
          name='ArrowLeft'
          size={32}
          className='text-brand-blue-700 cursor-pointer'
          onClick={() => router.back()}
        />
      )}
      <div className='w-full flex text-typo-base border-brand-blue-700 pl-6 pr-4 py-1.25 bg-brand-gray-0 rounded-[30px] border-2 items-center flex-1 gap-2'>
        <input
          placeholder='장소 검색'
          className='text-brand-gray-600 w-full outline-none'
        />
        <Icon
          name='Search'
          size={32}
          className='text-brand-blue-700'
        />
      </div>
    </div>
  );
}
