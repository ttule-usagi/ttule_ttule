'use client';

import { useDroppable } from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState, useMemo } from 'react';

import { Icon } from '@/components/common/Icon';
import { useGetPlanMyRole } from '@/hooks/plan/useGetPlanMyRole';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { useUpdatePlanItem } from '@/hooks/plan/useUpdatePlanItem';
import { deletePlanItem } from '@/lib/actions/planItem';
import { PlanSchedule, PlanItem, PlanInfo } from '@/types/plan';

import PanelHeader from './panelitem/PanelHeader';
import { PlaceItems } from './panelitem/PlaceItems';
import PlaceItemsEditView from './panelitem/PlaceItemsEditView';
import { EditModeItemDraft } from './panelItemDetail/EditModeItem';

interface PlanDayPanelProps {
  plan: Pick<PlanInfo, 'title' | 'departureDate' | 'arrivalDate'>;
  planId: string;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  items: PlanItem[];
  isFetching: boolean;
  totalDays: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenPlaceDetail: (item: PlanItem) => void;
  hasSession: boolean;
}

export default function PlanDayPanel({
  plan,
  planId,
  schedule,
  schedules,
  totalDays,
  currentIndex,
  onPrev,
  onNext,
  items,
  isFetching,
  hasSession,
  onOpenPlaceDetail,
}: PlanDayPanelProps) {
  const queryClient = useQueryClient();

  const { data: myRole } = useGetPlanMyRole(planId);
  const { setNodeRef } = useDroppable({ id: schedule.id, data: { scheduleId: schedule.id } });

  const [isEditingAll, setIsEditingAll] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, EditModeItemDraft>>({});
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(new Set());
  const [isSavingAll, setIsSavingAll] = useState(false);
  const { mutateAsync: updatePlanItem, isPending: isUpdating } = useUpdatePlanItem({ planId });

  const visibleItems = useMemo(() => items.filter((item) => !pendingRemovals.has(item.id)), [items, pendingRemovals]);

  const handleStartEditAll = () => {
    setDrafts(
      Object.fromEntries(
        items.map((item) => [
          item.id,
          { placeName: item.placeName, visitTime: item.visitTime ?? '', memoContent: item.memoContent ?? '' },
        ]),
      ),
    );
    setPendingRemovals(new Set());
    setIsEditingAll(true);
  };

  const handleCancelEditAll = () => {
    setIsEditingAll(false);
  };

  const handleChangeDraft = (itemId: string, patch: Partial<EditModeItemDraft>) => {
    setDrafts((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }));
  };

  const handleRemoveItemDraft = (itemId: string) => {
    setPendingRemovals((prev) => new Set(prev).add(itemId));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      await Promise.all(Array.from(pendingRemovals).map((itemId) => deletePlanItem(itemId)));

      await Promise.all(
        visibleItems.map((item) => {
          const draft = drafts[item.id];
          return item.type === 'memo'
            ? updatePlanItem({
                type: 'memo',
                itemId: item.id,
                scheduleId: item.scheduleId,
                placeName: draft.placeName ?? item.placeName,
                visitTime: draft.visitTime,
                memoContent: draft.memoContent,
              })
            : updatePlanItem({
                type: 'place',
                itemId: item.id,
                scheduleId: item.scheduleId,
                visitTime: draft.visitTime,
                memoContent: draft.memoContent,
              });
        }),
      );

      await queryClient.invalidateQueries({
        queryKey: scheduleItemsQueryOptions(planId, schedule.id).queryKey,
      });

      setIsEditingAll(false);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handlePrefetchNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
  };

  return (
    <div
      ref={setNodeRef}
      className='relative h-full w-full max-w-118'
    >
      {/* 이전 화살표 */}
      {currentIndex > 0 && !isEditingAll && (
        <button
          onClick={onPrev}
          className='absolute -left-5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center'
          aria-label='이전 일차'
        >
          <Icon
            name='PageLeft'
            size={42}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 다음 화살표 */}
      {currentIndex < totalDays - 1 && !isEditingAll && (
        <button
          onClick={onNext}
          onMouseEnter={handlePrefetchNext}
          onFocus={handlePrefetchNext}
          className='absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center'
          aria-label='다음 일차'
        >
          <Icon
            name='PageRight'
            size={42}
            className='text-brand-gray-600'
          />
        </button>
      )}

      {/* 안쪽 파란 패널 — 이 블록 안에서 모든 레이아웃 흐름을 제어합니다 */}

      <div className='absolute top-0 bottom-0 left-8 right-8 bg-line-pattern-blue rounded-lg shadow-xl flex flex-col overflow-hidden'>
        {/* 우표장식 (배경 느낌으로 absolute 띄움) */}
        <div className='absolute -top-[11px] right-7 pointer-events-none z-0'>
          <Image
            src='/images/poststamp.svg'
            alt='우표장식'
            width={190}
            height={100}
            style={{ width: 'auto' }}
          />
        </div>

        {/* 1. 패널 헤더 (고정 영역) */}
        <PanelHeader
          schedule={schedule}
          myRole={myRole}
          hasSession={hasSession}
          isEditingAll={isEditingAll}
          isSaving={isSavingAll || isUpdating}
          onStartEdit={handleStartEditAll}
          onCancel={handleCancelEditAll}
          onSave={handleSaveAll}
        />

        {/* 2. 아이템 목록 (스크롤 영역) */}
        {isEditingAll ? (
          <PlaceItemsEditView
            items={visibleItems}
            drafts={drafts}
            onChangeDraft={handleChangeDraft}
            onRemoveItem={handleRemoveItemDraft}
          />
        ) : (
          <PlaceItems
            plan={plan}
            planId={planId}
            schedule={schedule}
            schedules={schedules}
            items={items}
            isFetching={isFetching}
            myRole={myRole}
            hasSession={hasSession}
            onOpenPlaceDetail={onOpenPlaceDetail}
          />
        )}
      </div>
    </div>
  );
}
