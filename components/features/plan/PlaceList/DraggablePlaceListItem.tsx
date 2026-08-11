// DraggablePlaceListItem.tsx (또는 기존 PlaceItem.tsx 안에 직접)
import { useDraggable } from '@dnd-kit/core';

import type { Place } from '@/types/placeList';

export function DraggablePlaceListItem({ place, children }: { place: Place; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `place-list-${place.id}`, // plan_item id와 겹치지 않도록 접두사
    data: { type: 'place-list-item', place },
    disabled: place.latitude === null || place.longitude === null, // 좌표 없는 장소는 드래그 불가
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-drag-item
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
}
