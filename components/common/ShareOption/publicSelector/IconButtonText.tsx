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
        flex flex-row md:flex-col items-start md:items-center rounded-sm border px-5 py-4 md:p-5.5 flex-1 cursor-pointer gap-2 md:gap-0
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
        className='mt-1 md:pt-0 size-5 md:size-6'
      />
      <div className='flex flex-col items-start md:items-center'>
        <span className='text-typo-base md:mt-1'>{buttonText}</span>
        <p className='text-typo-caption text-brand-gray-500 font-light'>{description}</p>
      </div>
    </button>
  );
}
