'use client';

import { Icon } from '@/components/common/Icon';

interface MoreButtonProps {
  onClick: () => unknown;
}

export default function MoreButton({ onClick }: MoreButtonProps) {
  return (
    <button
      className='flex px-4 py-2 gap-1 rounded-[28px] border box-border border-brand-blue-700 text-brand-blue-700 cursor-pointer items-center justify-center'
      onClick={onClick}
    >
      <Icon
        name='ChevronDown'
        size={24}
      />
      더보기
    </button>
  );
}
