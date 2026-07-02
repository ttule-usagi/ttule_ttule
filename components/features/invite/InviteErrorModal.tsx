import { useModalStore } from '@/lib/store/modalStore';
import ModalBox from '../../common/Modal/ModalBox';
import { Icon } from '@/components/common/Icon';

interface ErrorModalProps {
  title: string;
  description: string;
  buttonText?: string;
}

export default function InviteErrorModal({ title, description, buttonText = '확인' }: ErrorModalProps) {
  const { close } = useModalStore();
  return (
    <ModalBox width={312}>
      <div className='w-full flex items-center justify-center -mb-2.5'>
        <div className='w-12 h-12 bg-error-bg rounded-full flex items-center justify-center'>
          <Icon
            name='AlertCircle'
            size={24}
            className='text-error-solid'
          />
        </div>
      </div>

      {/* 타이틀 */}
      <p className={`text-typo-base-bold text-brand-gray-800 w-full text-center font-medium`}>{title}</p>

      <ModalBox.ModalContent>
        <div className='-mt-4 mb-1 font-light'>{description}</div>
      </ModalBox.ModalContent>
      <ModalBox.ModalBottomContent>
        <button
          className='p-2 rounded-sm w-full cursor-pointer bg-error-solid text-brand-gray-0 font-medium'
          onClick={close}
        >
          {buttonText}
        </button>
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
