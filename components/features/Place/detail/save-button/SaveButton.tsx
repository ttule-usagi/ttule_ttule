import { Icon, IconName } from '@/components/common/Icon';

interface SaveButtonProps {
  iconName: IconName;
  buttonText: string;
  onClick?: () => void;
}

export default function SaveButton({ iconName, buttonText, onClick }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className='flex-1 flex items-center justify-center rounded-lg gap-2.5 px-3.5 py-2.5 border border-brand-gray-200 bg-white'
    >
      <Icon
        name={iconName}
        size={18}
      />
      <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>{buttonText}</span>
    </button>
  );
}
