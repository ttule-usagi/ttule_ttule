'use client';

import CorePlaceSearchResultItem from '@/components/features/search/CorePlaceSearchResultItem';
import RegisterNewPlaceBanner from '@/components/features/search/RegisterNewPlaceBanner';
import { useSearchPlaces } from '@/hooks/place-search/useSearchPlaces';
import { toCamelKey } from '@/lib/utils/toCamelCase';
import { PlaceSearchResults } from '@/types/CorePlace';
import { useEffect, useRef } from 'react';

interface SearchResultListProps {
  keyword: string;
}

export default function CoreSearchResultList({ keyword }: SearchResultListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = useSearchPlaces(keyword);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // 리스트 바닥 근처에 도달하면 다음 페이지(offset)를 불러옴
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const camelCaseItems = toCamelKey<PlaceSearchResults>(data);
  const items = camelCaseItems.items;

  return (
    <div className='flex flex-col gap-3'>
      {items.length > 0 && (
        <>
          <p className='text-typo-base text-brand-gray-600'>장소 검색 결과</p>
          {items.map((item) => (
            <CorePlaceSearchResultItem
              key={item.id}
              result={item}
            />
          ))}
          {isFetchNextPageError && (
            <div className='text-typo-description text-tag-red-text text-center py-3'>
              추가 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </div>
          )}
          <div ref={observerTargetRef} />
        </>
      )}
      <RegisterNewPlaceBanner keyword={keyword} />
    </div>
  );
}
