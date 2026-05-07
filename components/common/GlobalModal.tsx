'use client';

import { useModalStore } from '@/lib/store/modalStore';
import EnterInviteLinkModal from '../features/Plan/EnterInviteLinkModal';

/**
 * 전역 모달 컴포넌트
 *
 * - Zustand(modalStore)의 modal 상태에 따라 해당 모달을 렌더링
 * - 오버레이 클릭 시 모달 닫힘 (onClick={close})
 * - 새 모달 추가 시: ModalType에 타입 추가 → 조건부 렌더링 한 줄 추가
 *
 * @note 모달 콘텐츠 내부에 onClick={(e) => e.stopPropagation()} 이 없으면
 *       내부 클릭 시에도 모달이 닫힙니다.
 */

export default function GlobalModal() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  return (
    <div
      className='modal-overlay'
      onClick={close}
    >
      {modal === 'enterInviteLink' && <EnterInviteLinkModal />}
    </div>
  );
}
