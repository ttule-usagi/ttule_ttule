'use client';

import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlanPlaceListContainer from '@/components/features/plan/PlaceList/PlanPlaceListContainer';
import PlanDayPanel from '@/components/features/plan/plan-detail/PlanDayPanel';
import { useOpenPlaceDetailModal } from '@/hooks/place/useOpenPlaceDetailModal';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { scheduleItemsQueryOptions, useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { useMovePlanItem } from '@/hooks/plan/useMovePlanItem';
import { addPlanItemFromPlaceListItem } from '@/lib/actions/planItem';
import { DESTINATIONS } from '@/lib/utils/destinations';
import { PlaceCategory } from '@/types/corePlace';
import { Place } from '@/types/placeList';
import { PlanItem } from '@/types/plan';

import GoogleMapEmbed from '../../map/GoogleMapEmbed';
import GoogleMapJS from '../../map/GoogleMapJS';
import CorePlaceDetailContainer from '../../place/CorePlaceDetailContainer';
import { PlaceListDragPreview } from '../PlaceList/PlaceListDragPreview';

import { PlanDragPreview } from './panelItemDetail/PlanDragPreview';

interface PlanDetailContainerProps {
  planId: string;
  hasSession: boolean;
}

export default function PlanDetailContainer({ planId, hasSession }: PlanDetailContainerProps) {
  const queryClient = useQueryClient();
  const { data } = useGetPlanDetail(planId);
  const { plan, schedules, items: firstScheduleItems } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSchedule = schedules[Math.min(currentIndex, schedules.length - 1)];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: {
          x: 5,
          y: 5,
        },
      },
    }),
  );
  const { mutate: movePlanItem } = useMovePlanItem({ planId });

  type ActiveDrag = { type: 'plan-item'; item: PlanItem } | { type: 'place-list-item'; place: Place };
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();

  const { data: items = [], isFetching } = useGetScheduleItems(
    planId,
    currentSchedule.id,
    currentIndex === 0 ? firstScheduleItems : undefined,
  );

  const coordinates = useMemo(
    () =>
      items
        .filter((item) => item.latitude && item.longitude)
        .map((item) => ({
          lat: item.latitude!,
          lng: item.longitude!,
          placeName: item.placeName,
          category: item.placeCategory as PlaceCategory | null,
        })),
    [items],
  );

  const [prevScheduleId, setPrevScheduleId] = useState(currentSchedule.id);
  const [prevItemsSignature, setPrevItemsSignature] = useState(() => items.map((i) => i.id).join(','));
  const [stableCoordinates, setStableCoordinates] = useState(coordinates);
  const [placeListPreview, setPlaceListPreview] = useState<PlanItem[] | null>(null);

  const scheduleChanged = currentSchedule.id !== prevScheduleId;
  const itemsSignature = items.map((i) => i.id).join(',');
  const itemsChanged = itemsSignature !== prevItemsSignature;

  // 매 렌더마다 조건을 체크하여 stableCoordinates를 업데이트
  if ((scheduleChanged || itemsChanged) && !isFetching) {
    setPrevScheduleId(currentSchedule.id);
    setPrevItemsSignature(itemsSignature);
    setStableCoordinates(coordinates);
  }

  const destination =
    DESTINATIONS.find((c) => c.city === plan.destination) ?? DESTINATIONS.find((c) => c.city === '서울')!; // 못찾으면 한국 기본값

  const handleNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    // 이전 일차는 이미 한번 조회했던 캐시가 남아있을 가능성이 높아서 prefetch 불필요
    setCurrentIndex((i) => i - 1);
  };

  const calculateNewOrder = (reorderedItems: PlanItem[], newIndex: number): number => {
    const prevOrder = reorderedItems[newIndex - 1]?.order;
    const nextOrder = reorderedItems[newIndex + 1]?.order;

    if (prevOrder === undefined && nextOrder === undefined) return 1;
    if (prevOrder === undefined) return nextOrder! - 1;
    if (nextOrder === undefined) return prevOrder + 1;
    return (prevOrder + nextOrder) / 2;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current;
    if (activeData?.type === 'place-list-item') {
      setActiveDrag({ type: 'place-list-item', place: activeData.place });
      return;
    }
    const item = items.find((i) => i.id === event.active.id);
    setActiveDrag(item ? { type: 'plan-item', item } : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    setPlaceListPreview(null);
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;

    // 1. 장소 리스트에서 일정 추가
    if (activeType === 'place-list-item') {
      const overIndex = items.findIndex((i) => i.id === over.id);
      const insertIndex = overIndex === -1 ? items.length : overIndex;
      const newOrder = calculateNewOrder(items, insertIndex);
      const place = active.data.current?.place as Place;

      addPlanItemFromPlaceListItem({
        scheduleId: currentSchedule.id,
        place,
        order: newOrder,
      }).then((result) => {
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: scheduleItemsQueryOptions(planId, currentSchedule.id).queryKey });
        }
      });
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    // 드래그 후 최종 배치를 먼저 시뮬레이션
    const reordered = arrayMove(items, activeIndex, overIndex);
    const newIndex = reordered.findIndex((item) => item.id === active.id); // === overIndex와 동일

    movePlanItem({
      itemId: active.id as string,
      newOrder: calculateNewOrder(reordered, newIndex),
      sourceScheduleId: currentSchedule.id,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== 'place-list-item') {
      setPlaceListPreview(null);
      return;
    }

    const overIndex = items.findIndex((i) => i.id === over.id);
    const insertIndex = overIndex === -1 ? items.length : overIndex;

    const ghost = { id: '__ghost__place-list' /* PlanItem 형태를 맞추기 위한 최소 더미 필드 */ } as PlanItem;
    const preview = [...items];
    preview.splice(insertIndex, 0, ghost);
    setPlaceListPreview(preview);
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
    setPlaceListPreview(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className='relative h-screen w-full overflow-hidden'>
        {stableCoordinates.length > 0 ? (
          <GoogleMapJS
            coordinates={stableCoordinates}
            defaultCenter={{ lat: destination.latitude, lng: destination.longitude }}
            defaultZoom={5}
          />
        ) : (
          <GoogleMapEmbed
            mode='view'
            center={`${destination.latitude},${destination.longitude}`}
            zoom='11'
          />
        )}
        {/* 오른쪽 일정 패널 */}
        <QueryBoundary>
          <div className='absolute top-22 right-10 bottom-6 max-w-118 min-w-98.5 w-[40vw]'>
            <PlanDayPanel
              plan={plan}
              planId={planId}
              schedule={currentSchedule}
              schedules={schedules}
              items={placeListPreview ?? items}
              isFetching={isFetching}
              currentIndex={currentIndex}
              totalDays={schedules.length}
              onPrev={handlePrev}
              onNext={handleNext}
              variant='floating'
              onOpenPlaceDetail={(item) => handleClickPlaceItem(item.placeId)}
              hasSession={hasSession}
            />
          </div>
        </QueryBoundary>
        {hasSession && <PlanPlaceListContainer planId={planId} />}
      </div>
      {isOpenPlaceModal &&
        selectedId &&
        createPortal(
          <div
            className='modal-overlay-clear'
            onClick={handleClosePlaceDetailModal}
          >
            <div
              className='absolute right-103 lg:right-123 w-90 rounded-lg overflow-y-auto max-h-[90vh] bottom-6 top-42 overscroll-contain z-25'
              onClick={(e) => e.stopPropagation()}
            >
              <QueryBoundary>
                <CorePlaceDetailContainer
                  placeId={selectedId ?? ''}
                  onClose={handleClosePlaceDetailModal}
                />
              </QueryBoundary>
            </div>
          </div>,
          document.body,
        )}
      <DragOverlay>
        {activeDrag?.type === 'plan-item' ? <PlanDragPreview item={activeDrag.item} /> : null}
        {activeDrag?.type === 'place-list-item' ? <PlaceListDragPreview place={activeDrag.place} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
