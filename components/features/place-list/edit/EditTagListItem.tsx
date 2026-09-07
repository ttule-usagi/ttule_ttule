import { Tag } from '@/types/placeList';

interface EditTagListItemProps {
  tag: Tag;
  isActivated: boolean;
  onClick: () => void;
}

export default function EditTagListItem({ tag, isActivated, onClick }: EditTagListItemProps) {
  return (
    <button
      className={`flex items-center justify-center shrink-0 box-border px-3 py-1.5 rounded-sm cursor-pointer border gap-1 ${isActivated ? 'bg-brand-gray-400 text-brand-gray-0 border-transparent' : 'text-brand-gray-500 hover:bg-brand-gray-100 border-brand-gray-300'}`}
      onClick={onClick}
      data-drag-item
    >
      {tag.name}
    </button>
  );
}
