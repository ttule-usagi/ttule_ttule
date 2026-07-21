'use client';

import { Icon } from '@/components/common/Icon';
import { useModalStore } from '@/lib/store/modalStore';

export default function JoinPlaceListButton() {
  const { open } = useModalStore();
  return (
    <button
      className='flex gap-0.5 px-2.5 py-1.75 text-brand-blue-700 text-typo-description bg-neon-green border border-[#AFE40E] box-border cursor-pointer h-full rounded-sm items-center justify-center'
      onClick={() => open({ type: 'enterInviteLink', props: { type: 'place_list' } })}
    >
      <Icon
        name='Plus'
        size={18}
      />
      참여하기
    </button>
  );
}
