'use client';

import { createPortal } from 'react-dom';

import { useDropdown } from './DropdownContext';

interface DropDownMenuProps {
  children: React.ReactNode;
  minWidth?: boolean;
  className?: string;
}

export default function DropDownMenu({ children, minWidth = true, className }: DropDownMenuProps) {
  const { isOpen, setFloating, floatingStyles, getFloatingProps } = useDropdown();

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={setFloating}
      style={floatingStyles}
      className={
        className || `flex flex-col bg-white rounded-lg shadow-md ${minWidth ? 'min-w-60.25' : ''} z-100 p-2 gap-1`
      }
      {...getFloatingProps()}
    >
      {children}
    </div>,
    document.body,
  );
}
