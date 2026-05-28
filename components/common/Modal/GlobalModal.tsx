'use client';

import { ModalPropMap, ModalProps, useModalStore } from '@/lib/store/modalStore';
import EnterInviteLinkModal from '../../features/Plan/EnterInviteLinkModal';
import CancelSignupModal from '@/components/features/CancelSignupModal';
import ShareLinkModal from '../ShareLinkModal';

/**
 * 전역 모달 컴포넌트
 *
 * - Zustand(modalStore)의 modal 상태에 따라 해당 모달을 렌더링
 * - 오버레이 클릭 시 모달 닫힘 (onClick={close})
 * - 새 모달 추가 시: ModalType에 타입 추가 → 조건부 렌더링 한 줄 추가
 */

export default function GlobalModal() {
  const { modal, props, close } = useModalStore();

  if (!modal) return null;

  return (
    <div
      className='modal-overlay'
      onClick={close}
    >
      {modal === 'enterInviteLink' && <EnterInviteLinkModal />}
      {modal === 'cancelSignup' && <CancelSignupModal />}
      {modal === 'editLink' && (
        <ShareLinkModal
          type='EDIT'
          link={(props as ModalPropMap['editLink']).link}
        />
      )}
      {modal === 'viewLink' && (
        <ShareLinkModal
          type='VIEW'
          link={(props as ModalPropMap['viewLink']).link}
        />
      )}
    </div>
  );
}
