import { useState } from 'react';

import { useModalStore } from '@/lib/store/modalStore';

import CancelButton from './CancelButton';
import ConfirmButton from './ConfirmButton';
import { Icon } from './Icon';
import ModalBox from './Modal/ModalBox';

interface ConfirmActioinModalProps {
  description: string;
  confirmButtonText: string;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmActionModal({ description, onConfirm, confirmButtonText }: ConfirmActioinModalProps) {
  const { close } = useModalStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      // 에러 없이 완료되면 모달 닫기
      // TODO: 추후 성공 토스트 반환하도록 수정
      close();
    } catch (error) {
      // API 호출 실패 시 로딩 상태 해제
      // 에러 핸들링은 호출부(Hook)에 위임
      console.error('❌ 실패: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBox
      width={312}
      isCloseIcon={false}
    >
      <div className='w-full flex items-center justify-center -mb-2.5'>
        <div className='w-12 h-12 bg-brand-blue-50 rounded-full flex items-center justify-center'>
          <Icon
            name='AlertCircle'
            size={24}
            className='text-brand-blue-700'
          />
        </div>
      </div>

      <ModalBox.ModalContent>
        <div className='mb-1 font-light'>{description}</div>
      </ModalBox.ModalContent>
      <ModalBox.ModalBottomContent>
        <CancelButton
          text='취소'
          onClick={close}
          disabled={isLoading}
        />
        <ConfirmButton
          text={isLoading ? '적용중...' : confirmButtonText}
          onClick={handleConfirm}
          disabled={isLoading}
        />
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
