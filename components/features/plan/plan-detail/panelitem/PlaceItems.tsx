import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

import PlanItemCard from '@/components/features/plan/plan-detail/panelItemDetail/PlanItemCard';
import { useAddPlanMemoItem } from '@/hooks/plan/useAddPlanMemoItem';
import { useMovePlanItem } from '@/hooks/plan/useMovePlanItem';
import { useUpdatePlanItem } from '@/hooks/plan/useUpdatePlanItem';
import { ActionResult } from '@/types/errors';
import { PlanInfo, PlanItem, PlanSchedule } from '@/types/plan';
import { Role } from '@/types/shareOption';

import ChangeScheduleModal from '../panelItemDetail/ChangeScheduleModal';
import PlanItemEditCard from '../panelItemDetail/PlanItemEditCard';
import PlanMemoItemCard from '../panelItemDetail/PlanMemoItemCard';
import PlanMemoItemCreateCard from '../panelItemDetail/PlanMemoItemCreateCard';
import PlanMemoItemEditCard from '../panelItemDetail/PlanMemoItemEditCard';
import { SortablePlanItem } from '../panelItemDetail/SortablePlanItem';
import TransitInfo from '../panelItemDetail/TransitInfo';

import AddPlaceItem from './AddPlaceItem';

interface PlanDayPanelProps {
  plan: Pick<PlanInfo, 'title' | 'departureDate' | 'arrivalDate'>;
  planId: string;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  items: PlanItem[];
  isFetching: boolean;
  myRole: Role | null;
  onOpenPlaceDetail: (item: PlanItem) => void;
  hasSession: boolean;
}

export function PlaceItems({
  plan,
  planId,
  items,
  isFetching,
  schedule,
  hasSession,
  myRole,
  schedules,
  onOpenPlaceDetail,
}: PlanDayPanelProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isNewMemoOpen, setIsNewMemoOpen] = useState(false);
  const [changingScheduleItem, setChangingScheduleItem] = useState<PlanItem | null>(null);
  const { mutate: moveToSchedule, isPending: isMoving } = useMovePlanItem({ planId });

  // 장소/메모 수정 훅
  const { addMemoItem, isSubmitting: isAdding } = useAddPlanMemoItem();
  const { mutate: updatePlanItem, isPending: isUpdating } = useUpdatePlanItem({ planId });

  const closeOnSuccess = (result: ActionResult<null>) => {
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
        placeName: updated.placeName,
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
    <>
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
        <AddPlaceItem
          hasSession={hasSession}
          myRole={myRole}
          OnOpenNewMemo={() => setIsNewMemoOpen(true)}
        />

        {items.length === 0 && !isFetching ? (
          <div className='flex-1 flex items-center justify-center pb-10'>
            <p className='text-typo-description text-white'>저장된 장소가 없습니다.</p>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
