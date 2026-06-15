'use client';

import { getEmojiList, IconType } from '@/lib/emoji';
import { use } from 'react';

const emojiListPromise = getEmojiList();

export default function EmojiPicker({ onClick }: { onClick: (icon: IconType) => void }) {
  const emojiList = use(emojiListPromise);

  return (
    <div className='grid grid-cols-8 gap-px bg-brand-gray-100 border box-border rounded-sm border-brand-gray-300 overflow-hidden overflow-y-scroll h-60 font-mona12'>
      {emojiList.map((icon) => (
        <button
          type='button'
          key={icon.name}
          onClick={() => onClick(icon)}
          className='py-2 px-3 bg-white cursor-pointer'
        >
          {icon.emoji}
        </button>
      ))}
    </div>
  );
}
