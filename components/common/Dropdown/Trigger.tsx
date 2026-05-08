import { useDropdown } from './DropdownContext';

interface DropDownTriggerProps {
  children: React.ReactNode;
}

export default function DropDownTrigger({ children }: DropDownTriggerProps) {
  const { setReference, getReferenceProps } = useDropdown();
  return (
    <button
      ref={setReference}
      {...getReferenceProps()}
      className='cursor-pointer'
    >
      {children}
    </button>
  );
}
