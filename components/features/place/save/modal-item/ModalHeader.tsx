import { Icon } from '@/components/common/Icon';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className='flex items-center justify-between w-full'>
      <p className='text-typo-base-bold font-medium text-brand-gray-700'>{title}</p>
      <button
        onClick={onClose}
        aria-label='닫기'
      >
        <Icon
          name='XClose'
          size={26}
          className='text-brand-gray-400 cursor-pointer hover:bg-brand-gray-100 rounded-full'
        />
      </button>
    </div>
  );
}
