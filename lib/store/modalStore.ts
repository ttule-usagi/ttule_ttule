import { create } from 'zustand';

/**
 * 모달의 상태를 관리하는 Zustand 스토어
 *
 * - modal: 현재 열려있는 모달의 종류 (ModalType) 또는 null (모달 닫힘)
 * - open: 모달을 여는 함수, ModalType을 인자로 받아 modal 상태를 해당 타입으로 설정
 * - close: 모달을 닫는 함수, modal 상태를 null로 설정
 *
 * ModalType은 현재 'editLink', 'viewLink', 'enterInviteLink', 'confirm', 'cancelSignup' 다섯 가지 타입이 정의되어 있으며, 필요에 따라 새로운 모달 타입을 추가할 수 있음
 */

type ModalType = 'editLink' | 'viewLink' | 'enterInviteLink' | 'confirm' | 'cancelSignup';

interface ModalState {
  modal: ModalType | null;
  open: (type: ModalType) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  open: (type) => set({ modal: type }),
  close: () => set({ modal: null }),
}));
