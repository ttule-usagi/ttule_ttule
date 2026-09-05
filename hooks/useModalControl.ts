import { useRef } from 'react';

import { useModalStore } from '@/lib/store/modalStore';

export const useModalControl = () => {
  const { close } = useModalStore();
  const isClickOverlay = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isClickOverlay.current = e.target === e.currentTarget;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickOverlay.current && e.target === e.currentTarget) {
      close();
    }
    isClickOverlay.current = false;
  };

  return {
    isClickOverlay,
    handleMouseDown,
    handleMouseUp,
  };
};
