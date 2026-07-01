import { useModalStore } from '@/lib/store/modalStore';
import ModalBox from './Modal/ModalBox';

interface ErrorModalProps {
  title: string;
  description: string;
  buttonText?: string;
}

export default function ErrorModal({ title, description, buttonText = '확인' }: ErrorModalProps) {
  const { close } = useModalStore();
  return (
    <ModalBox
      width={320}
      isCloseIcon={false}
    >
      <ModalBox.ModalTitle
        title={title}
        error={true}
      />
      <ModalBox.ModalContent>
        <div className='-mt-1 mb-1'>{description}</div>
      </ModalBox.ModalContent>
      <ModalBox.ModalBottomContent>
        <button
          className='modal-button bg-tag-red-text text-brand-gray-0'
          onClick={close}
        >
          {buttonText}
        </button>
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
