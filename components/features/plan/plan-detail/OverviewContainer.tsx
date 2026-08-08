'use client';

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }));
  const { mutate: movePlanItem } = useMovePlanItem({ planId });

  type ActiveDrag = { type: 'plan-item'; item: PlanItem } | { type: 'place-list-item'; place: Place };
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);

  const calculateNewOrder = (items: PlanItem[], overIndex: number): number => {
    const prevOrder = items[overIndex - 1]?.order;
    const nextOrder = items[overIndex]?.order;
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
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;

    const targetScheduleId = over.data.current?.scheduleId as string | undefined;
    if (!targetScheduleId) return;

    const activeType = active.data.current?.type;

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

    // 기존 plan_item: 같은 날짜 재정렬 / 다른 날짜로 이동
    const sourceScheduleId = active.data.current?.scheduleId as string;
    if (active.id === over.id && sourceScheduleId === targetScheduleId) return;

    const targetItems = getCachedItems(targetScheduleId);
    const activeIndex = sourceScheduleId === targetScheduleId ? targetItems.findIndex((i) => i.id === active.id) : -1;
    const overIndex = targetItems.findIndex((i) => i.id === over.id);
    if (overIndex === -1) return;

    const reordered = activeIndex === -1 ? targetItems : arrayMove(targetItems, activeIndex, overIndex);
    const newIndex = activeIndex === -1 ? overIndex : reordered.findIndex((i) => i.id === active.id);

    movePlanItem({
      itemId: active.id as string,
      newOrder: calculateNewOrder(reordered, newIndex),
      sourceScheduleId,
      targetScheduleId: sourceScheduleId === targetScheduleId ? undefined : targetScheduleId,
    });
  };

  const isPlaceListOpen = usePlanPlaceListStore((s) => s.isOpen);
  const { ref: dragScrollRef, ...dragHandler } = useDragScroll<HTMLDivElement>();

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={dragScrollRef}
          {...dragHandler}
          className={`flex flex-row pt-23 pb-6 overflow-x-auto h-screen ml-25 ${isPlaceListOpen && 'ml-110'}`}
        >
          {schedules.map((schedule, index) => (
            <OverviewDayEntry
              key={schedule.id}
              planId={planId}
              plan={plan}
              schedule={schedule}
              schedules={schedules}
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

        <DragOverlay>
          {activeDrag?.type === 'plan-item' ? <PlanDragPreview item={activeDrag.item} /> : null}
          {activeDrag?.type === 'place-list-item' ? <PlaceListDragPreview place={activeDrag.place} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
