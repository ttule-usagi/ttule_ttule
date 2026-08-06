'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import ModalBox from '@/components/common/Modal/ModalBox';
import { useModalStore } from '@/lib/store/modalStore';

export default function DeletePlanDateModal({
  onConfirm,
  onCancel,
  dayNumber,
  type,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  dayNumber: number;
  type: 'deleteDayPlan' | 'deleteAllPlanItems';
}) {
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
        {type === 'deleteDayPlan' ? (
          <div className='pt-8 pb-5'>
            {dayNumber}일차 계획을 삭제하시겠어요? <br />({dayNumber}일차 계획과 일정이 모두 삭제됩니다.)
          </div>
        ) : (
          <div className='pt-8 pb-5'>
            {dayNumber}일차 계획에 포함된 전체 일정을 삭제하시겠어요? ({dayNumber}일차 계획은 유지되며, 일정만
            삭제됩니다.)
          </div>
        )}
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
