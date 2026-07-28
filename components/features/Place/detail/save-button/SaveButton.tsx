import { Icon, IconName } from '@/components/common/Icon';

interface SaveButtonProps {
  iconName: IconName;
  buttonText: string;
  onClick?: () => void;
  isSaved?: boolean;
}

export default function SaveButton({ iconName, buttonText, onClick, isSaved = false }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center rounded-lg gap-1.5 px-3.5 py-2.5 border  cursor-pointer ${isSaved ? 'border-brand-blue-200 bg-brand-blue-50' : 'border-brand-gray-200'}`}
    >
      <Icon
        name={iconName}
        size={18}
        className='text-brand-blue-700'
      />
      <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>{buttonText}</span>
    </button>
  );
}
