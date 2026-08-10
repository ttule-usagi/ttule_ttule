'use client';

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  type DragEndEvent,
  closestCenter,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useOpenPlaceDetailModal } from '@/hooks/place/useOpenPlaceDetailModal';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { useMovePlanItem } from '@/hooks/plan/useMovePlanItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { addPlanItemFromPlaceListItem } from '@/lib/actions/planItem';
import { usePlanPlaceListStore } from '@/lib/store/planPlaceListStore';
import { Place } from '@/types/placeList';
import { PlanItem } from '@/types/plan';

import CorePlaceDetailContainer from '../../place/CorePlaceDetailContainer';
import { PlaceListDragPreview } from '../PlaceList/PlaceListDragPreview';
import PlanPlaceListContainer from '../PlaceList/PlanPlaceListContainer';

import { OverviewDayEntry } from './OverviewDayEntry';
import { PlanDragPreview } from './panelItemDetail/PlanDragPreview';

export default function OverviewContainer({ planId, hasSession }: { planId: string; hasSession: boolean }) {
  const queryClient = useQueryClient();
  const { data } = useGetPlanDetail(planId);
  const { plan, schedules, items: firstScheduleItems } = data;
  const { isOpenPlaceModal, selectedId, handleClickPlaceItem, handleClosePlaceDetailModal } = useOpenPlaceDetailModal();

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
  const [crossDayPreview, setCrossDayPreview] = useState<{ scheduleId: string; items: PlanItem[] } | null>(null);

  const calculateNewOrder = (items: PlanItem[], overIndex: number): number => {
    if (items.length === 0) return 1;

    // 인덱스 범위 안전 보장
    const safeIndex = Math.max(0, Math.min(overIndex, items.length));

    const prevOrder = items[safeIndex - 1]?.order;
    const nextOrder = items[safeIndex]?.order;

    if (prevOrder === undefined && nextOrder === undefined) return 1;
    if (prevOrder === undefined) return nextOrder! - 1;
    if (nextOrder === undefined) return prevOrder + 1;

    return (prevOrder + nextOrder) / 2;
  };

  const getCachedItems = (scheduleId: string): PlanItem[] =>
    queryClient.getQueryData<PlanItem[]>(scheduleItemsQueryOptions(planId, scheduleId).queryKey) ?? [];

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current;
    if (activeData?.type === 'place-list-item') {
      setActiveDrag({ type: 'place-list-item', place: activeData.place });
      return;
    }
    const sourceScheduleId = activeData?.scheduleId;
    const item = sourceScheduleId && getCachedItems(sourceScheduleId).find((i) => i.id === event.active.id);
    setActiveDrag(item ? { type: 'plan-item', item } : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setCrossDayPreview(null);
    setActiveDrag(null);

    const { active, over } = event;
    if (!over) return;

    const targetScheduleId = over.data.current?.scheduleId as string | undefined;
    if (!targetScheduleId) return;

    const activeType = active.data.current?.type;

    // 1. 장소 리스트에서 일정 추가
    if (activeType === 'place-list-item') {
      const targetItems = getCachedItems(targetScheduleId);
      const overIndex = targetItems.findIndex((i) => i.id === over.id);
      const newOrder = calculateNewOrder(targetItems, overIndex);
      const place = active.data.current?.place as Place;

      addPlanItemFromPlaceListItem({
        scheduleId: targetScheduleId,
        place,
        order: newOrder,
      }).then((result) => {
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: scheduleItemsQueryOptions(planId, targetScheduleId).queryKey });
        }
      });
      return;
    }

    // 2. 기존 plan_item: 같은 날짜 재정렬 / 다른 날짜로 이동
    const sourceScheduleId = active.data.current?.scheduleId as string;
    if (active.id === over.id && sourceScheduleId === targetScheduleId) return;

    const activeItem = getCachedItems(sourceScheduleId).find((i) => i.id === active.id);
    if (!activeItem) return;

    const targetItems = getCachedItems(targetScheduleId);
    const withoutActive = targetItems.filter((i) => i.id !== active.id);

    const overIndexInWithoutActive = withoutActive.findIndex((i) => i.id === over.id);

    // active가 원래 targetItems 안에 있었는지(같은 날짜 재정렬) 확인
    const activeIndexInTarget = targetItems.findIndex((i) => i.id === active.id);
    const overIndexInTarget = targetItems.findIndex((i) => i.id === over.id);

    let insertIndex: number;
    if (overIndexInWithoutActive === -1) {
      // over가 목록 끝을 가리키는 경우 등
      insertIndex = withoutActive.length;
    } else if (activeIndexInTarget !== -1 && activeIndexInTarget < overIndexInTarget) {
      // 같은 날짜 내에서 "아래로" 이동: over의 원래 자리를 차지 (over를 밀어냄)
      insertIndex = overIndexInWithoutActive + 1;
    } else {
      // 위로 이동, 혹은 다른 날짜에서 넘어온 아이템: over 앞에 삽입
      insertIndex = overIndexInWithoutActive;
    }
    const newOrder = calculateNewOrder(withoutActive, insertIndex);

    movePlanItem({
      itemId: active.id as string,
      newOrder,
      sourceScheduleId,
      targetScheduleId: sourceScheduleId === targetScheduleId ? undefined : targetScheduleId,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type === 'place-list-item') {
      setCrossDayPreview(null);
      return;
    }

    if (active.data.current?.type === 'place-list-item') {
      setCrossDayPreview(null);
      return;
    }

    const sourceScheduleId = active.data.current?.scheduleId as string | undefined;
    const targetScheduleId = over.data.current?.scheduleId as string | undefined;

    // 같은 날짜 내 이동이거나 스케줄 ID가 없으면 미리보기 해제
    if (!sourceScheduleId || !targetScheduleId || sourceScheduleId === targetScheduleId) {
      setCrossDayPreview(null);
      return;
    }

    const sourceItems = getCachedItems(sourceScheduleId);
    const targetItems = getCachedItems(targetScheduleId);
    const activeItem = sourceItems.find((i) => i.id === active.id);
    if (!activeItem) return;

    const overIndex = targetItems.findIndex((i) => i.id === over.id);
    const insertIndex = overIndex === -1 ? targetItems.length : overIndex;

    setCrossDayPreview((prev) => {
      const ghostId = `__ghost__${active.id}`;

      // 이미 동일한 위치에 고스트가 배치되어 있다면 setState를 건너뛰어 무한 렌더링 방지
      if (prev?.scheduleId === targetScheduleId) {
        const prevGhostIndex = prev.items.findIndex((i) => i.id === ghostId);
        if (prevGhostIndex === insertIndex) return prev;
      }
      const preview = targetItems.filter((i) => i.id !== active.id);
      preview.splice(insertIndex, 0, { ...activeItem, id: ghostId });
      return { scheduleId: targetScheduleId, items: preview };
    });
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
    setCrossDayPreview(null);
  };

  const isPlaceListOpen = usePlanPlaceListStore((s) => s.isOpen);
  const { ref: dragScrollRef, ...dragHandler } = useDragScroll<HTMLDivElement>();

  return (
    <>
      <DndContext
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          ref={dragScrollRef}
          {...dragHandler}
          className={`flex flex-row pt-23 pb-6 overflow-x-auto h-screen ml-23 ${isPlaceListOpen && 'ml-114'}`}
        >
          {schedules.map((schedule, index) => (
            <OverviewDayEntry
              key={schedule.id}
              planId={planId}
              plan={plan}
              schedule={schedule}
              schedules={schedules}
              previewItems={crossDayPreview?.scheduleId === schedule.id ? crossDayPreview.items : undefined}
              initialItems={index === 0 ? firstScheduleItems : undefined}
              hasSession={hasSession}
              onOpenPlaceDetail={(item) => handleClickPlaceItem(item.placeId)}
            />
          ))}
        </div>
        {hasSession && <PlanPlaceListContainer planId={planId} />}

        {isOpenPlaceModal &&
          selectedId &&
          createPortal(
            <div className='fixed left-120 w-90 rounded-lg overflow-y-auto max-h-[90vh] top-1/2 -translate-y-1/2 overscroll-contain'>
              <QueryBoundary>
                <CorePlaceDetailContainer
                  placeId={selectedId}
                  onClose={handleClosePlaceDetailModal}
                />
              </QueryBoundary>
            </div>,
            document.body,
          )}

        <DragOverlay dropAnimation={null}>
          {activeDrag?.type === 'plan-item' ? <PlanDragPreview item={activeDrag.item} /> : null}
          {activeDrag?.type === 'place-list-item' ? <PlaceListDragPreview place={activeDrag.place} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
