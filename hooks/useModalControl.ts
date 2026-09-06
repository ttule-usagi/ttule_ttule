import { useRef } from 'react';

export const useModalControl = (onClose: () => void) => {
  const isClickOverlay = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isClickOverlay.current = e.target === e.currentTarget;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickOverlay.current && e.target === e.currentTarget) {
      onClose();
    }
    isClickOverlay.current = false;
  };

  return {
    isClickOverlay,
    handleMouseDown,
    handleMouseUp,
  };
};
