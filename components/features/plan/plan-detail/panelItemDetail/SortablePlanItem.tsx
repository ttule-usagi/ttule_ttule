import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createContext, useContext, useMemo } from 'react';

interface DragHandleContextValue {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

const DragHandleContext = createContext<DragHandleContextValue | null>(null);

export function useDragHandle() {
  const context = useContext(DragHandleContext);
  if (!context) {
    throw new Error('useDragHandle은 SortablePlanItem 내부에서만 사용할 수 있습니다.');
  }
  return context;
}

export function SortablePlanItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // opacity 대신
  };

  const contextValue = useMemo(() => ({ attributes, listeners }), [attributes, listeners]);

  return (
    <DragHandleContext.Provider value={contextValue}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        suppressHydrationWarning
        className='flex flex-col gap-2 shrink-0 cursor-grab'
      >
        {children}
      </div>
    </DragHandleContext.Provider>
  );
}
