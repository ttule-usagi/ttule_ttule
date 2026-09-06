import { Icon } from '@/components/common/Icon';
import { Tag } from '@/types/placeList';

interface EditTagListItemProps {
  tag: Tag;
  isActivated: boolean;
  onClick: () => void;
}

export default function EditTagListItem({ tag, isActivated, onClick }: EditTagListItemProps) {
  return (
    <button
      className={`flex items-center justify-center shrink-0 box-border px-3 py-1.5 rounded-sm cursor-pointer border gap-1 border-brand-blue-700 ${isActivated ? 'bg-brand-blue-700 text-brand-gray-0' : 'text-brand-blue-700 hover:bg-brand-gray-100'}`}
      onClick={onClick}
      data-drag-item
    >
      {isActivated && (
        <Icon
          name='Check'
          size={18}
        />
      )}
      {tag.name}
    </button>
  );
}
