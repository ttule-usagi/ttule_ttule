import { Icon } from '../Icon';

import ModalTitle from './ModalTitle';
import ModalContent from './ModalContent';
import ModalBottomContent from './ModalBottomContent';
import { useModalStore } from '@/lib/store/modalStore';

interface ModalBoxProps {
  children: React.ReactNode;
}

export default function ModalBox({ children }: ModalBoxProps) {
  const { close } = useModalStore();
  return (
    <div
      className='flex flex-col gap-5 bg-white aspect-560/191 rounded-lg relative pt-7 px-6 pb-6 w-[clamp(380px,35vw,560px)]'
      onClick={(e) => e.stopPropagation()}
    >
      <Icon
        name='XClose'
        size={32}
        className='absolute top-3 right-3 text-brand-gray-500 cursor-pointer'
        onClick={close}
      />
      {children}
    </div>
  );
}

ModalBox.ModalTitle = ModalTitle;
ModalBox.ModalContent = ModalContent;
ModalBox.ModalBottomContent = ModalBottomContent;
