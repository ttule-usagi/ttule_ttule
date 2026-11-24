import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useState } from 'react';

import { MD_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';

import { DropdownContent } from './DropdownContext';
import DropDownItem from './Item';
import DropDownMenu from './Menu';
import DropDownTrigger from './Trigger';

interface DropDownProps {
  children: React.ReactNode;
  placement?: Placement;
  offsetValue?: number;
}

export default function DropDown({ children, placement = 'right-start', offsetValue = 18 }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery(MD_QUERY);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: isDesktop ? autoUpdate : undefined,
    placement: placement,
    middleware: isDesktop ? [offset(offsetValue), flip({ padding: 8 }), shift({ padding: 8 })] : [],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context, { role: isDesktop ? 'menu' : 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <DropdownContent.Provider
      value={{
        isOpen,
        isDesktop,
        context,
        setReference: refs.setReference,
        setFloating: refs.setFloating,
        floatingStyles,
        getFloatingProps,
        getReferenceProps,
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </DropdownContent.Provider>
  );
}

DropDown.Item = DropDownItem;
DropDown.Menu = DropDownMenu;
DropDown.Trigger = DropDownTrigger;
