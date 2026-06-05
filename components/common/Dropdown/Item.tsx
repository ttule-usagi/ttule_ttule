import { useDropdown } from './DropdownContext';

interface DropDownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DropDownItem({ children, onClick }: DropDownItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
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
