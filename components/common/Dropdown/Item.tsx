import { HTMLAttributes } from 'react';
import { useDropdown } from './DropdownContext';

interface DropDownItemProps extends HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  disabled?: boolean;
  size?: 'normal' | 'mini';
}

export default function DropDownItem({
  children,
  onClick,
  disabled = false,
  size = 'normal',
  className = '',
  isSelected = false,
  ...props
}: DropDownItemProps) {
  const { close } = useDropdown();

  const sizeClasses = size === 'mini' ? 'px-[7.5px] py-1 text-typo-description' : 'px-5 py-2 text-typo-base';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    close();
    onClick?.(e);
  };

  return (
    <div
      {...props}
      className={`w-full font-light text-left text-brand-gray-700 cursor-pointer hover:bg-brand-gray-100 rounded-lg ${sizeClasses} ${className} ${isSelected ? 'text-brand-gray-600 font-medium' : ''}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
