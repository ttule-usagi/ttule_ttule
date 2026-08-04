'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export default function PlanDetailMemoContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const truncated = el.scrollHeight > el.clientHeight;
    setIsTruncated((prev) => (prev !== truncated ? truncated : prev));
  }, [content]);

  return (
    <div className='relative flex flex-col gap-1'>
      <p
        ref={textRef}
        className={isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-1'}
      >
        {content}
      </p>
      {(isTruncated || isExpanded) && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className='absolute bottom-0.5 -right-7 text-typo-caption text-brand-blue-600'
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
}
