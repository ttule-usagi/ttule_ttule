'use client';

import { CorePlaceSearchResult } from '@/types/CorePlace';

export default function CorePlaceSearchResultItem({ result }: { result: CorePlaceSearchResult }) {
  return (
    <div
      className='w-full border rounded-sm border-brand-gray-300 bg-brand-gray-0 p-3 cursor-pointer'
      onClick={() => console.log(`${result.id} 클릭`)}
    >
      {result.koreanName}
    </div>
  );
}
