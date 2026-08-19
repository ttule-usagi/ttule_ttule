import { Icon, IconName } from '../../Icon';

interface IconTextButtonProps {
  iconName: IconName;
  isSelected?: boolean;
  disabled?: boolean;
  onClick: () => void;
  buttonText: string;
  description: string;
}

export function IconButtonText({
  iconName,
  isSelected,
  disabled,
  onClick,
  buttonText,
  description,
}: IconTextButtonProps) {
  return (
    <button
      className={`
        flex flex-col items-center rounded-sm border p-5.5 flex-1 cursor-pointer
        ${
          isSelected
            ? 'border-brand-blue-600 bg-brand-blue-50 text-brand-blue-700'
            : 'border-brand-gray-200 text-brand-gray-600 hover:bg-brand-gray-50'
        }
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon
        name={iconName}
        size={24}
      />
      <span className='text-typo-base mt-1'>{buttonText}</span>
      <p className='text-typo-caption text-brand-gray-500 font-light'>{description}</p>
    </button>
  );
}
