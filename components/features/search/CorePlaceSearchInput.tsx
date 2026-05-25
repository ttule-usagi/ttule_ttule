'use client';

import { Icon } from '@/components/common/Icon';
import { useDebounce } from '@/hooks/useDebounce';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DBSearchInput() {
  const path = usePathname();
  const router = useRouter();

  // 자동완성 api, 검색 결과 api 필요
  // 엔터키 누르기 전, 자동완성 항목 클릭 전까지는 자동완성 항목 노출
  // 엔터키 누른 후에는 결과 리스트
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    if (debounced.trim() === '') return;

    // 자동완성 api 호출
  }, [debounced]);

  // 검색 결과 api 호출하는 검색 결과 페이지로 이동
  const handleSubmitValue = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (value.trim() === '') return;
    router.push(`/places/search?query=${encodeURIComponent(value)}`);
  };

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
      <form
        className='w-full flex text-typo-base border-brand-blue-700 pl-6 pr-4 py-1.25 bg-brand-gray-0 rounded-[30px] border-2 items-center flex-1 gap-2'
        onSubmit={handleSubmitValue}
      >
        <input
          placeholder='장소 검색'
          className='text-brand-gray-600 w-full outline-none'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type='button'
          className='text-brand-blue-700 cursor-pointer'
        >
          <Icon
            name='Search'
            size={32}
          />
        </button>
      </form>
    </div>
  );
}
