import React, { useCallback, useEffect, useRef } from 'react';

export const useDragScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const moveX = useRef(0); // 이동 임계값 처리용

  // 마우스로 클릭 시작
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // 현재 클릭된 값이 없으면 중단
    if (!ref.current) return;
    // 클릭된 값이 있으면 드래그 시작 위치 저장(좌측에서 시작)
    isDragging.current = true;
    moveX.current = 0; // 드래그 시작할 때마다 임계값 초기화
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;

    // 드래그중임을 표시하기 위해 스타일 지정
    ref.current.style.cursor = 'grabbing';
    ref.current.style.userSelect = 'none';
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (!ref.current) return;
    ref.current.style.cursor = 'grab';
    ref.current.style.removeProperty('user-select');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      // 이동 거리를 계속 업데이트
      const dist = x - startX.current;
      moveX.current = dist; // 임계값에 현재 위치 저장(클릭 방지)
      el.scrollLeft = scrollLeft.current - (x - startX.current);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: false });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    // 5px 이상 움직였다면(드래그중이면) 클릭 무시
    if (Math.abs(moveX.current) > 5) {
      e.stopPropagation();
    }
  }, []);

  return {
    ref,
    onMouseDown,
    onMouseUp: stopDrag, // 드래그 종료 감지
    onMouseLeave: stopDrag, // 마우스가 컴포넌트 밖으로 나가면 드래그 종료
    onClick,
    style: { cursor: 'grab' }, // 기본 커서를 손 모양으로 설정
  };
};
