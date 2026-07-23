'use client';

import { Tag } from '@/types/placeList';

// 장소 리스트에 포함될 단일 태그 아이템들(상단에 위치)
interface TagListItemProps {
  tag: Tag;
  isActivated: boolean;
  onClick: () => void;
}

export default function TagListItem({ tag, isActivated, onClick }: TagListItemProps) {
  return (
    <button
      className={`flex items-center justify-center shrink-0 box-border px-3 py-1.5 rounded-[40px] cursor-pointer border border-brand-blue-700 ${isActivated ? 'text-brand-gray-50 bg-brand-blue-700' : 'text-brand-blue-700'}`}
      onClick={onClick}
    >
      {tag.name}
    </button>
  );
}
