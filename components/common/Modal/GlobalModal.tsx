'use client';

import CancelSignupModal from '@/components/features/CancelSignupModal';
import CancelNewPlaceModal from '@/components/features/new-place/CancelNewPlaceModal';
import TagModal from '@/components/features/place-list/tag/TagModal';
import DeletePlanDateModal from '@/components/features/plan/plan-detail/DeletePlanDateModal';
import DeletePlanItemModal from '@/components/features/plan/plan-detail/DeletePlanItemModal';
import { useModalControl } from '@/hooks/useModalControl';
import { useModalStore } from '@/lib/store/modalStore';

import EnterInviteLinkModal from '../../features/plan/EnterInviteLinkModal';
import ConfirmActionModal from '../ConfirmActionModal';
import ErrorModal from '../ErrorModal';
import ShareLinkModal from '../ShareLinkModal';

/**
 * 전역 모달 컴포넌트
 *
 * - Zustand(modalStore)의 modal 상태에 따라 해당 모달을 렌더링
 * - 오버레이 클릭 시 모달 닫힘 (onClick={close})
 * - 새 모달 추가 시: ModalType에 타입 추가 → 조건부 렌더링 한 줄 추가
 */

export default function GlobalModal() {
  const { activeModal, close } = useModalStore();
  const { handleMouseDown, handleMouseUp } = useModalControl(close);

  if (!activeModal) return null;

  return (
    <div
      className='modal-overlay'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {activeModal.type === 'enterInviteLink' && <EnterInviteLinkModal type={activeModal.props.type} />}
      {activeModal.type === 'cancelSignup' && <CancelSignupModal />}
      {activeModal.type === 'cancelNewPlace' && <CancelNewPlaceModal onCancel={activeModal.props.onCancel} />}
      {activeModal.type === 'shareLink' && (
        <ShareLinkModal
          type={activeModal.props.type}
          link={activeModal.props.link}
        />
      )}
      {activeModal.type === 'error' && (
        <ErrorModal
          title={activeModal.props.title}
          description={activeModal.props.description}
        />
      )}
      {activeModal.type === 'confirmAction' && (
        <ConfirmActionModal
          description={activeModal.props.description}
          confirmButtonText={activeModal.props.confirmButtonText}
          onConfirm={activeModal.props.onConfirm}
        />
      )}
      {activeModal.type === 'deletePlanItem' && (
        <DeletePlanItemModal
          onConfirm={activeModal.props.onConfirm}
          onCancel={close}
        />
      )}
      {activeModal.type === 'deletePlanDate' && (
        <DeletePlanDateModal
          onConfirm={activeModal.props.onConfirm}
          onCancel={close}
          dayNumber={activeModal.props.dayNumber}
          type={activeModal.props.type}
        />
      )}
      {activeModal.type === 'tag' && <TagModal listId={activeModal.props.listId} />}
    </div>
  );
}
