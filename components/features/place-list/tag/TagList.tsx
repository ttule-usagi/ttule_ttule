'use client';

import { useGetPlaceListTags } from '@/hooks/place-list/useGetPlaceListTags';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useModalStore } from '@/lib/store/modalStore';

import TagListItem from './TagListItem';

interface TagListProps {
  listId: string;
  activeTagIds: Set<string>;
  onToggleTag: (id: string) => void;
}

// 장소 리스트에 포함된 태그를 보여주는 태그 리스트 컴포넌트(상단에 위치)
export default function TagList({ listId, activeTagIds, onToggleTag }: TagListProps) {
  const { open } = useModalStore();
  const { data } = useGetPlaceListTags(listId);
  const { ref, ...dragHandler } = useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      {...dragHandler}
      className='flex gap-2 overflow-x-scroll flex-1 items-center no-scrollbar'
    >
      {data.map((item) => (
        <TagListItem
          key={item.id}
          tag={item}
          isActivated={activeTagIds.has(item.id)}
          onClick={() => onToggleTag(item.id)}
        />
      ))}
      <button
        className='px-3 py-1.75 text-brand-blue-700 shrink-0 hover:bg-black/5 rounded-full cursor-pointer'
        onClick={() => open({ type: 'tag', props: { listId } })}
      >
        태그 수정
      </button>
    </div>
  );
}
