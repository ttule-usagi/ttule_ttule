'use client';

import { Icon } from '@/components/common/Icon';
import TagListItem from './TagListItem';
import { useState } from 'react';
import { useGetPlaceListTags } from '@/hooks/place-list/useGetPlaceListDetail';
import { useDragScroll } from '@/hooks/useDragScroll';

// 장소 리스트에 포함된 태그를 보여주는 태그 리스트 컴포넌트(상단에 위치)
export default function TagList({ listId }: { listId: string }) {
  const { data } = useGetPlaceListTags(listId);
  const { ref, ...dragHandler } = useDragScroll<HTMLDivElement>();
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const handleToggleTag = (id: string) => {
    setActiveIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  return (
    <div className='flex gap-2 text-typo-description items-center'>
      <button className='flex gap-1 px-3 py-1.5 rounded-[40px] bg-brand-gray-200 items-center text-brand-gray-600'>
        최근 수정
        <Icon
          name='ChevronDown'
          size={18}
        />
      </button>
      <div
        ref={ref}
        {...dragHandler}
        className='flex gap-2 overflow-x-scroll flex-1 items-center no-scrollbar'
      >
        {data.map((item) => (
          <TagListItem
            key={item.id}
            tag={item}
            isActivated={activeIds.includes(item.id)}
            onClick={() => handleToggleTag(item.id)}
          />
        ))}
        <button className='px-3 py-1.75 text-brand-blue-700 shrink-0'>태그 수정</button>
      </div>
    </div>
  );
}
