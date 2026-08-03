'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useAddPlanMemoItem } from '@/hooks/plan/useAddPlanMemoItem';
import { useGetPlanMyRole } from '@/hooks/plan/useGetPlanMyRole';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { useMovePlanItem } from '@/hooks/plan/useMovePlanItem';
import { useUpdatePlanItem } from '@/hooks/plan/useUpdatePlanItem';
import { usePlanPlaceListStore } from '@/lib/store/planPlaceListStore';
import { usePlanSearchStore } from '@/lib/store/planSearchStore';
import { ActionResult } from '@/types/errors';
import { PlanSchedule, PlanItem, PlanInfo } from '@/types/plan';

import AuthorityWrapper from '../../AuthorityWrapper';

import ChangeScheduleModal from './ChangeScheduleModal';
import PlanItemCard from './PlanItemCard';
import PlanItemEditCard from './PlanItemEditCard';
import PlanMemoItemCard from './PlanMemoItemCard';
import PlanMemoItemCreateCard from './PlanMemoItemCreateCard';
import PlanMemoItemEditCard from './PlanMemoItemEditCard';
import { SortablePlanItem } from './SortablePlanItem';
import TransitInfo from './TransitInfo';

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

function formatScheduleDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}.${day}(${weekday})`;
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

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isNewMemoOpen, setIsNewMemoOpen] = useState(false);
  const [changingScheduleItem, setChangingScheduleItem] = useState<PlanItem | null>(null);
  const { mutate: moveToSchedule, isPending: isMoving } = useMovePlanItem({ planId });

  const dateStr = formatScheduleDate(schedule.scheduleDate);

  const { data: myRole } = useGetPlanMyRole(planId);
  const { triggerFocus } = usePlanSearchStore();
  const { triggerOpenPlaceList } = usePlanPlaceListStore();

  const { setNodeRef } = useDroppable({ id: schedule.id, data: { scheduleId: schedule.id } });

  const handlePrefetchNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
  };

  // 장소/메모 수정 훅
  const { addMemoItem, isSubmitting: isAdding } = useAddPlanMemoItem();
  const { mutate: updatePlanItem, isPending: isUpdating } = useUpdatePlanItem({ planId });

  const closeOnSuccess = (result: ActionResult<null>) => {
    console.log('updatePlanItem result:', result); // 임시 로그
    if (result.success) setEditingItemId(null);
  };

  const handleSavePlaceItem = (item: PlanItem, updated: { visitTime: string; memoContent: string }) => {
    updatePlanItem(
      { type: 'place', itemId: item.id, scheduleId: item.scheduleId, ...updated },
      {
        onSuccess: closeOnSuccess,
        onError: (error) => {
          console.error('저장 실패:', error);
        },
      },
    );
  };

  const handleSaveExistingMemo = (
    item: PlanItem,
    updated: { placeName: string; visitTime: string | null; memoContent: string | null },
  ) => {
    updatePlanItem(
      {
        type: 'memo',
        itemId: item.id,
        scheduleId: item.scheduleId,
        visitTime: updated.visitTime ?? '',
        memoContent: updated.memoContent ?? '',
      },
      { onSuccess: closeOnSuccess },
    );
  };

  const handleSaveNewMemo = async (updated: {
    placeName: string;
    visitTime: string | null;
    memoContent: string | null;
  }) => {
    const result = await addMemoItem({ scheduleId: schedule.id, ...updated });
    if (result?.success) setIsNewMemoOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      className='relative h-full w-full max-w-118'
    >
      {/* 이전 화살표 */}
      {currentIndex > 0 && (
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
      {currentIndex < totalDays - 1 && (
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
        <div className='flex-none flex items-start justify-between mt-6 mx-5 z-10'>
          <div className='flex flex-col items-start'>
            <p className='text-white font-semibold text-typo-title leading-8 tracking-[-0.72px]'>
              {schedule.dayNumber}일차
            </p>
            {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
          </div>

          {/* 편집/더보기 버튼 */}
          {hasSession && (
            <AuthorityWrapper
              role={myRole}
              requiredRole='editor'
            >
              <div className='flex gap-3 items-center'>
                <button className='text-white text-typo-base'>편집</button>
                <Icon
                  name='DotsHorizontal'
                  size={32}
                  className='text-white'
                />
              </div>
            </AuthorityWrapper>
          )}
        </div>

        {/* 2. 아이템 목록 (스크롤 영역) */}
        <div className='flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 mt-6 px-4 pb-4 z-10'>
          {isFetching ? (
            <div className='flex flex-col gap-2'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='w-full h-30 shrink-0 rounded-2 animate-skeleton mb-2'
                />
              ))}
            </div>
          ) : (
            <>
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item, index) => (
                  <SortablePlanItem
                    key={item.id}
                    id={item.id}
                  >
                    {item.type === 'memo' ? (
                      editingItemId === item.id ? (
                        <PlanMemoItemEditCard
                          item={item}
                          onClose={() => setEditingItemId(null)}
                          onSave={(updated) => handleSaveExistingMemo(item, updated)}
                          isSaving={isUpdating}
                        />
                      ) : (
                        <PlanMemoItemCard
                          item={item}
                          onClick={() => setEditingItemId(item.id)}
                          onChangeSchedule={() => setChangingScheduleItem(item)}
                          hasSession={hasSession}
                          myRole={myRole}
                        />
                      )
                    ) : editingItemId === item.id ? (
                      <PlanItemEditCard
                        item={item}
                        onClose={() => setEditingItemId(null)}
                        onSave={(updated) => handleSavePlaceItem(item, updated)}
                        isSaving={isUpdating}
                      />
                    ) : (
                      <PlanItemCard
                        item={item}
                        onClick={() => setEditingItemId(item.id)}
                        onOpenDetail={() => onOpenPlaceDetail(item)}
                        onChangeSchedule={() => setChangingScheduleItem(item)}
                        hasSession={hasSession}
                        myRole={myRole}
                      />
                    )}
                    {index < items.length - 1 && item.transitMode && items[index + 1].type !== 'memo' && (
                      <TransitInfo
                        mode={item.transitMode}
                        time={item.transitTime}
                        hasMemo={!!item.transitMemo}
                      />
                    )}
                  </SortablePlanItem>
                ))}
              </SortableContext>

              {isNewMemoOpen && (
                <PlanMemoItemCreateCard
                  onClose={() => setIsNewMemoOpen(false)}
                  onSave={handleSaveNewMemo}
                  isSaving={isAdding}
                />
              )}

              {changingScheduleItem && (
                <ChangeScheduleModal
                  plan={plan}
                  schedules={schedules}
                  currentScheduleId={changingScheduleItem.scheduleId}
                  onClose={() => setChangingScheduleItem(null)}
                  onConfirm={(targetScheduleId) => {
                    moveToSchedule(
                      {
                        itemId: changingScheduleItem.id,
                        newOrder: undefined,
                        sourceScheduleId: changingScheduleItem.scheduleId,
                        targetScheduleId,
                      },
                      {
                        onSuccess: (result) => {
                          if (result.success) setChangingScheduleItem(null);
                        },
                      },
                    );
                  }}
                  isSubmitting={isMoving}
                />
              )}
            </>
          )}
          {/* 3. 장소 추가 버튼 */}
          {hasSession && (
            <AuthorityWrapper
              role={myRole}
              requiredRole='editor'
            >
              <div className=' z-10'>
                <DropDown>
                  <DropDown.Trigger>
                    <div className='flex items-center justify-center cursor-pointer hover:bg-brand-blue-900/20 hover:backdrop-blur-sm transition-colors duration-200 ease-in-out'>
                      <Image
                        src='/images/new-plan-item.svg'
                        alt='장소 추가'
                        width={375}
                        height={87}
                        style={{ width: 'auto' }}
                        loading='eager'
                      />
                    </div>
                  </DropDown.Trigger>

                  <DropDown.Menu>
                    <DropDown.Item onClick={triggerOpenPlaceList}>리스트에서 장소 가져오기</DropDown.Item>
                    <DropDown.Item onClick={triggerFocus}>검색에서 장소 가져오기</DropDown.Item>
                    <DropDown.Item onClick={() => setIsNewMemoOpen(true)}>장소 없는 일정 만들기</DropDown.Item>
                  </DropDown.Menu>
                </DropDown>
              </div>
            </AuthorityWrapper>
          )}
          {items.length === 0 && !isFetching ? (
            <div className='flex-1 flex items-center justify-center pb-10'>
              <p className='text-typo-description text-white'>저장된 장소가 없습니다.</p>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
