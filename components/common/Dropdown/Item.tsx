import { useDropdown } from './DropdownContext';

interface DropDownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function DropDownItem({ children, onClick, disabled = false }: DropDownItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    if (disabled) return;
    close();
    onClick?.();
  };

  return (
    <div
      className='w-full text-typo-base font-light text-left text-brand-gray-700 cursor-pointer hover:bg-brand-gray-100 rounded-lg px-5 py-2 '
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
