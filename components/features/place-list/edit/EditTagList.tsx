import { Icon } from '@/components/common/Icon';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useModalStore } from '@/lib/store/modalStore';
import { Tag } from '@/types/placeList';

import EditTagListItem from './EditTagListItem';

interface EditTagListProps {
  listId: string;
  listTags: Tag[];
  activeTagIds: Set<string>;
  onToggleTag: (id: string) => void;
}

export default function EditTagList({ listId, listTags, activeTagIds, onToggleTag }: EditTagListProps) {
  const { open } = useModalStore();
  const { ref, ...dragHandler } = useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      {...dragHandler}
      className='flex gap-2 overflow-x-scroll flex-1 items-center no-scrollbar'
    >
      <button
        className='flex items-center gap-1 justify-center shrink-0 box-border px-3 py-1.5 rounded-sm cursor-pointer border border-brand-blue-700 text-brand-blue-700 hover:bg-brand-blue-700 hover:text-brand-gray-0'
        onClick={() => open({ type: 'tag', props: { listId } })}
      >
        <Icon
          name='Plus'
          size={18}
        />
        새 태그
      </button>
      {listTags.map((item) => (
        <EditTagListItem
          key={item.id}
          tag={item}
          isActivated={activeTagIds.has(item.id)}
          onClick={() => onToggleTag(item.id)}
        />
      ))}
      <button
        className='px-3 py-1.75 text-brand-blue-700 shrink-0 hover:bg-black/5 rounded-sm cursor-pointer'
        onClick={() => open({ type: 'tag', props: { listId } })}
      >
        태그 수정
      </button>
    </div>
  );
}
