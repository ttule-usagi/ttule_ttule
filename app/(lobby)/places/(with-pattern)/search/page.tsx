// 검색 결과 페이지

import { Icon } from '@/components/common/Icon';
import CorePlaceSearchResultItem from '@/components/features/search/CorePlaceSearchResultItem';
import { CorePlaceSearchResult } from '@/types/CorePlace';
import Link from 'next/link';

const data: CorePlaceSearchResult[] = [
  {
    id: 1,
    englishName: 'Loft Cafe',
    koreanName: '로프트 카페',
    address: '서울특별시 마포구 양화로 45',
    category: '카페',
    savedCount: 12,
  },
  {
    id: 2,
    englishName: 'Loft Studio',
    koreanName: '로프트 스튜디오',
    address: '서울특별시 강남구 테헤란로 123',
    category: '스튜디오',
    savedCount: 7,
  },
  {
    id: 3,
    englishName: 'Loft Workspace',
    koreanName: '로프트 워크스페이스',
    address: '서울특별시 종로구 종로 1',
    category: '공유오피스',
    savedCount: 21,
  },
];

interface CoreSearchPageProps {
  searchParams: Promise<{ query: string }>;
}

export default async function CoreSearchPage({ searchParams }: CoreSearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.query;

  // 검색 페이지 url에 직접 접근할 때를 대비하여 작성
  if (!keyword) {
    return <div>검색어를 입력해주세요.</div>;
  }

  // const res = await fetch('검색 결과 api 호출');
  // const data = await res.json();

  return (
    <div className='w-full flex flex-col'>
      {data.length > 0 ? (
        <div className='flex flex-col gap-3'>
          <p className='text-typo-base text-brand-gray-600'>장소 검색 결과</p>
          {data.map((item) => (
            <CorePlaceSearchResultItem
              key={item.id}
              result={item}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-2 items-center'>
          <p className='text-typo-description text-brand-gray-600 font-light'>찾는 장소가 없나요?</p>
          <Link
            href={'/google-search'}
            className='w-full py-3 flex gap-1 items-center justify-center bg-brand-blue-700 text-white rounded-sm'
          >
            <Icon
              name='Plus'
              size={20}
            />{' '}
            신규 장소 등록
          </Link>
        </div>
      )}
    </div>
  );
}
