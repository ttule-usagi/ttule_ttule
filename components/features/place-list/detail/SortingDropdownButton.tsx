'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { SortType } from '@/types/placeList';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortingDropdownButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sort');
  const handleSort = (sortBy: SortType) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortBy);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <DropDown
      placement='bottom'
      offsetValue={4}
    >
      <DropDown.Trigger className='flex gap-1 px-3 py-1.5 rounded-[40px] bg-brand-gray-200 items-center text-brand-gray-600'>
        {currentSortBy === 'updated' ? '최근수정' : currentSortBy === 'createdDesc' ? '최근등록' : '과거등록'}
        <Icon
          name='ChevronDown'
          size={18}
        />
      </DropDown.Trigger>

      <DropDown.Menu minWidth={false}>
        <DropDown.Item
          onClick={() => handleSort('updated')}
          size='mini'
          isSelected={currentSortBy === 'updated'}
        >
          최근 수정순
        </DropDown.Item>
        <DropDown.Item
          onClick={() => handleSort('createdDesc')}
          size='mini'
          isSelected={currentSortBy === 'createdDesc'}
        >
          최근 등록순
        </DropDown.Item>
        <DropDown.Item
          onClick={() => handleSort('createdAsc')}
          size='mini'
          isSelected={currentSortBy === 'createdAsc'}
        >
          과거 등록순
        </DropDown.Item>
      </DropDown.Menu>
    </DropDown>
  );
}
