'use client';

import { useModalStore } from '@/lib/store/modalStore';
import EnterInviteLinkModal from '../../features/Plan/EnterInviteLinkModal';
import CancelSignupModal from '@/components/features/CancelSignupModal';
import CancelNewPlaceModal from '@/components/features/new-place/CancelNewPlaceModal';

/**
 * 전역 모달 컴포넌트
 *
 * - Zustand(modalStore)의 modal 상태에 따라 해당 모달을 렌더링
 * - 오버레이 클릭 시 모달 닫힘 (onClick={close})
 * - 새 모달 추가 시: ModalType에 타입 추가 → 조건부 렌더링 한 줄 추가
 */

export default function GlobalModal() {
  const { activeModal, close } = useModalStore();

  if (!activeModal) return null;

  return (
    <div
      className='modal-overlay'
      onClick={close}
    >
      {activeModal.type === 'enterInviteLink' && <EnterInviteLinkModal />}
      {activeModal.type === 'cancelSignup' && <CancelSignupModal />}
      {activeModal.type === 'cancelNewPlace' && <CancelNewPlaceModal onCancel={activeModal.props.onCancel} />}
    </div>
  );
}
