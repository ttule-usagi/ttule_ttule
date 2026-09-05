import { Icon } from '@/components/common/Icon';
import { PLACE_TAG_COLOR } from '@/lib/constants/tag';
import { Tag } from '@/types/placeList';

interface PlaceTagProps {
  tag: Tag;
  isEdit?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  isRounded?: boolean;
}

export default function PlaceTag({ tag, onClick, isRounded = false, isEdit = false, isSelected }: PlaceTagProps) {
  return (
    <button
      className={`shrink-0  flex gap-1 items-center justify-center box-border ${isRounded ? 'rounded-[28px]' : 'rounded-sm'} border ${isEdit && !isSelected ? 'border-brand-gray-300 text-brand-gray-500' : PLACE_TAG_COLOR[tag.color]} ${isEdit ? 'text-typo-description px-3 py-1.5' : 'text-typo-caption px-2 py-1'}`}
      onClick={onClick}
      aria-pressed={isEdit ? isSelected : undefined}
    >
      {isEdit &&
        (isSelected ? (
          <Icon
            name='Check'
            size={18}
          />
        ) : (
          <Icon
            name='Plus'
            size={18}
          />
        ))}
      {tag.name}
    </button>
  );
}
