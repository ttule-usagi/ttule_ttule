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
    <ModalBox width={320}>
      <ModalBox.ModalTitle
        title={title}
        description={description}
        error={true}
      />
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
