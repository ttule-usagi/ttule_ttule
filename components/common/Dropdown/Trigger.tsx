import { ButtonHTMLAttributes } from 'react';
import { useDropdown } from './DropdownContext';

interface DropDownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function DropDownTrigger({ children, className = '', ...props }: DropDownTriggerProps) {
  const { setReference, getReferenceProps } = useDropdown();
  return (
    <button
      ref={setReference}
      {...getReferenceProps(props)}
      className={`cursor-pointer ${className}`.trim()}
    >
      {children}
    </button>
  );
}
