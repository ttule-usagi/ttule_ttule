'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import ModalBox from '@/components/common/Modal/ModalBox';
import { useModalStore } from '@/lib/store/modalStore';

export default function CancelNewPlaceModal({ onCancel }: { onCancel: () => void }) {
  const { close } = useModalStore();

  const handleCancel = async () => {
    onCancel?.();
    close();
  };

  return (
    <ModalBox
      isCloseIcon={false}
      width={320}
    >
      <ModalBox.ModalContent>
        <div className='pt-8 pb-5'>
          새로운 장소 등록을 중단하시겠어요? <br />
          지금까지 입력한 내용은 저장되지 않습니다.
        </div>
      </ModalBox.ModalContent>

      <ModalBox.ModalBottomContent>
        <CancelButton
          text='중단하기'
          onClick={handleCancel}
        />
        <ConfirmButton
          text='계속 진행'
          onClick={close}
        />
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
