'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { PlanItem } from '@/types/plan';

import EditModeItem, { type EditModeItemDraft } from '../panelItemDetail/EditModeItem';
import EditModeMemoItem from '../panelItemDetail/EditModeMemoItem';
import { SortablePlanItem } from '../panelItemDetail/SortablePlanItem';

interface PlaceItemsEditModeProps {
  items: PlanItem[];
  drafts: Record<string, EditModeItemDraft>;
  onChangeDraft: (itemId: string, patch: Partial<EditModeItemDraft>) => void;
  onRemoveItem: (itemId: string) => void;
  scheduleId: string;
}

export default function PlaceItemsEditView({
  items,
  drafts,
  onChangeDraft,
  onRemoveItem,
  scheduleId,
}: PlaceItemsEditModeProps) {
  return (
    <div
      data-vertical-scroll
      className='flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 mt-7 px-4 pb-4 z-10'
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortablePlanItem
            key={item.id}
            id={item.id}
            scheduleId={scheduleId}
          >
            {item.type === 'memo' ? (
              <EditModeMemoItem
                item={item}
                draft={drafts[item.id] ?? { visitTime: '', memoContent: '' }}
                onChange={(patch) => onChangeDraft(item.id, patch)}
                onRemove={() => onRemoveItem(item.id)}
              />
            ) : (
              <EditModeItem
                item={item}
                draft={drafts[item.id] ?? { visitTime: '', memoContent: '' }}
                onChange={(patch) => onChangeDraft(item.id, patch)}
                onRemove={() => onRemoveItem(item.id)}
              />
            )}
          </SortablePlanItem>
        ))}
      </SortableContext>
      {items.length === 0 ? (
        <div className='flex-1 flex items-center justify-center pb-10'>
          <p className='text-typo-description text-white'>저장된 장소가 없습니다.</p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
