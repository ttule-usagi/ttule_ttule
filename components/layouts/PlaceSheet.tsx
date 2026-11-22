'use client';

import { animate, motion, useDragControls, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const PEEK = 110; // 접힘 상태의 높이

type PlaceSheetProps = {
  children: React.ReactNode;
  paddingTop: string;
};

export default function PlaceSheet({ children, paddingTop }: PlaceSheetProps) {
  const y = useMotionValue(0);
  const controls = useDragControls();
  const [vh, setVh] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const isFullScreen = pathname.startsWith('/places/search');

  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const sheetH = vh * 0.87;
  const snaps = [0, sheetH * 0.5, sheetH - PEEK]; // 펼침 / 중간 / 접힘

  const snapTo = (target: number) => {
    animate(y, target, { type: 'spring', stiffness: 400, damping: 40 });
    setExpanded(target === snaps[0]);
  };

  const onDragEnd = (_: unknown, info: { velocity: { y: number } }) => {
    const projected = y.get() + info.velocity.y * 0.2; // 속도 반영
    const target = snaps.reduce((a, b) => (Math.abs(b - projected) < Math.abs(a - projected) ? b : a));
    snapTo(target);
  };

  const isFirst = useRef(true);

  useEffect(() => {
    if (!vh) return;
    const target = isFullScreen ? 0 : snaps[0];

    if (isFirst.current) {
      y.set(target); // 최초: 즉시 배치
      isFirst.current = false;
    } else {
      animate(y, target, { type: 'spring', stiffness: 400, damping: 40 });
    }
  }, [isFullScreen, vh]);

  return (
    // 바깥 래퍼는 터치를 통과시켜 지도 조작을 살림
    <div className='pointer-events-none fixed inset-0 z-10'>
      <motion.div
        style={{ y, height: sheetH }}
        drag={isFullScreen ? false : 'y'}
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: snaps[2] }}
        dragElastic={0.05}
        onDragEnd={onDragEnd}
        className={`pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col rounded-t-lg bg-line-pattern
        md:inset-x-auto md:pt-23 md:left-16 md:w-102 md:h-full! md:transform-none! md:rounded-none
        ${paddingTop} ${isFullScreen ? 'h-full!' : ''}`}
      >
        {/* 모바일 전용 드래그 핸들 */}
        {!isFullScreen && (
          <div
            onPointerDown={(e) => controls.start(e)}
            className='flex justify-center py-3 touch-none cursor-grab md:hidden'
          >
            <div className='h-1 w-10 rounded-full bg-gray-300' />
          </div>
        )}

        {/* 펼쳤을 때만 내부 스크롤 허용 */}
        <section
          className={`flex-1 min-h-0 overscroll-contain md:overflow-y-auto ${
            expanded || isFullScreen ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {children}
        </section>
      </motion.div>
    </div>
  );
}
