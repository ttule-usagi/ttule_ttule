'use client';

import { createPortal } from 'react-dom';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useOpenPlaceDetailModal } from '@/hooks/place/useOpenPlaceDetailModal';
import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListPlaces';
import { SortType } from '@/types/placeList';

import EmptyState from '../../../common/EmptyState';
import CorePlaceDetailContainer from '../../place/CorePlaceDetailContainer';

import PlaceItem from './PlaceItem';

export default function PlaceListPlaces({ listId, sortBy }: { listId: string; sortBy: SortType }) {
  const { data } = useGetPlaceListPlaces({ listId, sortBy });
  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();

  if (data.length === 0) return <EmptyState message='저장된 장소가 아직 없습니다.' />;

  return (
    <>
      {data.map((item) => (
        <PlaceItem
          key={item.id}
          place={item}
          listId={listId}
          onClickItem={handleClickPlaceItem}
        />
      ))}
      {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div className='absolute left-120 w-90 rounded-lg overflow-y-auto max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain'>
            <QueryBoundary>
              <CorePlaceDetailContainer
                placeId={selectedId}
                onClose={handleClosePlaceDetailModal}
              />
            </QueryBoundary>
          </div>,
          document.body,
        )}
    </>
  );
}
