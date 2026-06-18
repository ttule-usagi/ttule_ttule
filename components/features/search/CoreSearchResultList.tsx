'use client';

import CorePlaceSearchResultItem from '@/components/features/search/CorePlaceSearchResultItem';
import RegisterNewPlaceBanner from '@/components/features/search/RegisterNewPlaceBanner';
import { useSearchPlaces } from '@/hooks/place-search/useSearchPlaces';
import { useEffect, useRef } from 'react';

interface SearchResultListProps {
  keyword: string;
}

export default function CoreSearchResultList({ keyword }: SearchResultListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useSearchPlaces(keyword);
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

  const items = data?.items ?? [];

  // 첫 결과를 기다리는 중에는 결과/배너 UI를 보여주지 않음
  // TODO: 추후 스피너로 교체
  if (isLoading) {
    return <div className='text-typo-description text-brand-gray-400'>Loading...</div>;
  }

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
          <div ref={observerTargetRef} />
        </>
      )}
      <RegisterNewPlaceBanner keyword={keyword} />
    </div>
  );
}
