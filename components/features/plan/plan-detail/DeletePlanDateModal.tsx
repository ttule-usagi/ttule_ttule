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
            <p className='font-semibold mb-1'>
              <span className='text-brand-blue-600'>{dayNumber}일차 일정표</span>를 삭제하시겠어요?{' '}
            </p>
            <p className='text-typo-description text-brand-gray-400'>
              <span className='text-tag-red-text'>*</span>
              {dayNumber}
              일차 일정표와 일정이 모두 삭제됩니다.
            </p>
          </div>
        ) : (
          <div className='pt-8 pb-5'>
            <p className='font-semibold mb-1'>
              <span className='text-brand-blue-500'>일정표</span>에 포함된 <span className='font-bold'>전체 일정</span>
              을 삭제하시겠어요?
            </p>
            <p className='text-typo-description text-brand-gray-400'>
              <span className='text-tag-red-text'>*</span>
              일정표는 유지되며, 일정만 삭제됩니다.
            </p>
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
