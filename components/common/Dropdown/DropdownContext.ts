import type { FloatingContext, UseInteractionsReturn } from '@floating-ui/react';
import { createContext, useContext } from 'react';

export const DropdownContent = createContext<{
  isOpen: boolean;
  isDesktop: boolean;
  context: FloatingContext;
  close: () => void;
  setReference: ((node: Element | null) => void) | null;
  setFloating: ((node: HTMLElement | null) => void) | null;
  floatingStyles: React.CSSProperties;
  getReferenceProps: UseInteractionsReturn['getReferenceProps'];
  getFloatingProps: UseInteractionsReturn['getFloatingProps'];
} | null>(null);

export const useDropdown = () => {
  const context = useContext(DropdownContent);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
};
