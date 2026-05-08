import { useState } from 'react';
import DropDownItem from './Item';
import DropDownMenu from './Menu';
import DropDownTrigger from './Trigger';
import { DropdownContent } from './DropdownContext';
import { flip, offset, Placement, shift, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';

interface DropDownProps {
  children: React.ReactNode;
  placement?: Placement;
}

export default function DropDown({ children, placement = 'right-start' }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    middleware: [offset(24), flip(), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <DropdownContent.Provider
      value={{
        isOpen,
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
