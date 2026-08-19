import { useModalStore } from '@/lib/store/modalStore';

import { Icon } from '../Icon';

import ModalBottomContent from './ModalBottomContent';
import ModalContent from './ModalContent';
import ModalTitle from './ModalTitle';

interface ModalBoxProps {
  children: React.ReactNode;
  isCloseIcon?: boolean;
  width?: number;
  baseAspect?: boolean;
}

export default function ModalBox({ children, isCloseIcon = true, width = 560, baseAspect = true }: ModalBoxProps) {
  const { close } = useModalStore();
  return (
    <div
      className={`flex flex-col gap-5 bg-white rounded-lg relative pt-7 px-6 pb-6 ${baseAspect ? 'aspect-560/191' : 'max-h-187.5'} `}
      style={{ width: `clamp(320px,35vw,${width}px)` }}
      onClick={(e) => e.stopPropagation()}
    >
      {isCloseIcon && (
        <Icon
          name='XClose'
          size={32}
          className='absolute top-3 right-3 text-brand-gray-500 cursor-pointer rounded-full hover:bg-brand-gray-100 hover:text-brand-blue-700'
          onClick={close}
        />
      )}
      {children}
    </div>
  );
}

ModalBox.ModalTitle = ModalTitle;
ModalBox.ModalContent = ModalContent;
ModalBox.ModalBottomContent = ModalBottomContent;
