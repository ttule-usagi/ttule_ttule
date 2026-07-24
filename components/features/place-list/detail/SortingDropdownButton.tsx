'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { SortType } from '@/types/placeList';

export default function SortingDropdownButton({
  sortBy,
  onSortChange,
}: {
  sortBy: SortType;
  onSortChange: React.Dispatch<React.SetStateAction<SortType>>;
}) {
  return (
    <DropDown
      placement='bottom'
      offsetValue={4}
    >
      <DropDown.Trigger className='flex gap-1 px-3 py-1.5 rounded-[40px] bg-brand-gray-200 items-center text-brand-gray-600'>
        {sortBy === 'updated' ? '최근수정' : sortBy === 'createdDesc' ? '최근등록' : '과거등록'}
        <Icon
          name='ChevronDown'
          size={18}
        />
      </DropDown.Trigger>

      <DropDown.Menu minWidth={false}>
        <DropDown.Item
          onClick={() => onSortChange('createdDesc')}
          size='mini'
          isSelected={sortBy === 'createdDesc'}
        >
          최근 등록순
        </DropDown.Item>
        <DropDown.Item
          onClick={() => onSortChange('createdAsc')}
          size='mini'
          isSelected={sortBy === 'createdAsc'}
        >
          과거 등록순
        </DropDown.Item>
        <DropDown.Item
          onClick={() => onSortChange('updated')}
          size='mini'
          isSelected={sortBy === 'updated'}
        >
          최근 수정순
        </DropDown.Item>
      </DropDown.Menu>
    </DropDown>
  );
}
