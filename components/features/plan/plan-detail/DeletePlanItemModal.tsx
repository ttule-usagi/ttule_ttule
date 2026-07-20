'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import ModalBox from '@/components/common/Modal/ModalBox';
import { useModalStore } from '@/lib/store/modalStore';

export default function DeletePlanItemModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { close } = useModalStore();

  const handleCancel = async () => {
    onCancel?.();
    close();
  };

  const handleConfirm = async () => {
    await onConfirm();
    close();
  };

  return (
    <ModalBox
      isCloseIcon={false}
      width={320}
    >
      <ModalBox.ModalContent>
        <div className='pt-8 pb-5'>선택한 일정을 삭제하시겠어요?</div>
      </ModalBox.ModalContent>

      <ModalBox.ModalBottomContent>
        <CancelButton
          text='취소'
          onClick={handleCancel}
        />
        <ConfirmButton
          text='삭제하기'
          onClick={handleConfirm}
        />
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
