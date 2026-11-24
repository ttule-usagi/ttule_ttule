'use client';

import { FloatingFocusManager, FloatingOverlay, FloatingPortal } from '@floating-ui/react';

import { useDropdown } from './DropdownContext';

interface DropDownMenuProps {
  children: React.ReactNode;
  minWidth?: boolean;
  className?: string;
}

export default function DropDownMenu({ children, minWidth = true, className }: DropDownMenuProps) {
  const { isOpen, isDesktop, context, setFloating, floatingStyles, getFloatingProps, close } = useDropdown();

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      {isDesktop ? (
        <div
          ref={setFloating}
          style={floatingStyles}
          className={
            className || `flex flex-col bg-white rounded-lg shadow-md ${minWidth ? 'min-w-60.25' : ''} z-100 p-2 gap-1`
          }
          {...getFloatingProps()}
        >
          {children}
        </div>
      ) : (
        <FloatingOverlay
          lockScroll
          className='z-9999 bg-black/40'
        >
          <FloatingFocusManager context={context}>
            <div
              ref={setFloating}
              className='fixed inset-x-4 bottom-4 h-fit rounded-3xl bg-white pt-6 px-4 pb-8 mb-[env(safe-area-inset-bottom)] flex flex-col gap-3 z-99999'
              {...getFloatingProps()}
            >
              <div className='bg-brand-gray-100 rounded-xl flex flex-col py-1 divide-y divide-brand-gray-200'>
                {children}
              </div>
              <div
                onClick={close}
                className='w-full font-light text-center bg-brand-gray-100 text-brand-gray-700 cursor-pointer px-5 py-3 rounded-xl'
              >
                닫기
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
}
