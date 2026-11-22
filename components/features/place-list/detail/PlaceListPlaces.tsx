'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useOpenPlaceDetailModal } from '@/hooks/place/useOpenPlaceDetailModal';
import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListPlaces';
import { useGetPlaceListTags } from '@/hooks/place-list/useGetPlaceListTags';
import { SortType } from '@/types/placeList';

import EmptyState from '../../../common/EmptyState';
import CorePlaceDetailContainer from '../../place/CorePlaceDetailContainer';

import PlaceItem from './PlaceItem';

const MD_QUERY = '(min-width: 768px)';

export default function PlaceListPlaces({
  listId,
  sortBy,
  activeTagIds,
}: {
  listId: string;
  sortBy: SortType;
  activeTagIds: Set<string>;
}) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isFetchNextPageError } = useGetPlaceListPlaces({
    listId,
    sortBy,
  });
  const router = useRouter();

  // 태그 필터링
  const filteredPlaces = useMemo(() => {
    if (activeTagIds.size === 0) return data;
    return data.filter((place) => place.tags.some((tag) => activeTagIds.has(tag.id)));
  }, [activeTagIds, data]);

  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();
  const { data: tags } = useGetPlaceListTags(listId);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => {
      if (target) observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isFetchNextPageError]);

  // 해상도에 따른 장소 상세 분기
  const handleClickItem = (placeId: string) => {
    if (window.matchMedia(MD_QUERY).matches) {
      handleClickPlaceItem(placeId); // PC: 우측 모달 오픈
    } else {
      router.push(`/places/detail/${placeId}`); // 모바일: 상세 페이지 이동
    }
  };

  if (data.length === 0) return <EmptyState message='저장된 장소가 아직 없습니다.' />;

  return (
    <>
      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((item) => (
          <PlaceItem
            key={item.id}
            place={item}
            listId={listId}
            onClickItem={handleClickItem}
            listTags={tags}
          />
        ))
      ) : (
        <EmptyState message='저장된 장소가 아직 없습니다.' />
      )}
      {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div
            className='absolute left-120 w-90 rounded-lg overflow-hidden 
          flex flex-col max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain'
          >
            <QueryBoundary>
              <CorePlaceDetailContainer
                placeId={selectedId}
                onClose={handleClosePlaceDetailModal}
                isPadding={false}
              />
            </QueryBoundary>
          </div>,
          document.body,
        )}
      {hasNextPage && (
        <>
          {isFetchNextPageError && (
            <div className='w-full flex flex-col gap-2 items-center justify-center py-5'>
              <p className='text-brand-gray-600'>저장된 장소 추가 조회 실패</p>
              <button
                onClick={() => fetchNextPage()}
                className='bg-tag-red-text text-brand-gray-0 py-2 px-4 rounded-sm text-typo-description cursor-pointer'
              >
                다시 시도하기
              </button>
            </div>
          )}
          {!isFetchNextPageError && (
            <div
              ref={observerTargetRef}
              className='h-32'
            />
          )}
        </>
      )}
    </>
  );
}
