import { create } from 'zustand';

/**
 * 모달의 상태를 관리하는 Zustand 스토어
 *
 * - activeModal: 현재 열려있는 모달의 유니온 타입
 * - open: 모달을 여는 함수, open({type: 모달 타입, props: {prop1: '' ...}}) 와 같이 모달을 여는 곳에서 사용해줍니다.
 * - close: 모달을 닫는 함수, modal 상태를 null로 설정
 *
 * ModalPayload에 필요에 따라 새로운 모달 타입과 props를 추가할 수 있음
 */

type ModalPayload =
  | { type: 'enterInviteLink' | 'cancelSignup' } // props가 필요 없는 모달
  | { type: 'editLink'; props: { link: string } }
  | { type: 'viewLink'; props: { link: string } }
  | { type: 'cancelNewPlace'; props: { onCancel: () => void } };

interface ModalState {
  activeModal: ModalPayload | null;
  open: (payload: ModalPayload) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  open: (payload) => set({ activeModal: payload }),
  close: () => set({ activeModal: null }),
}));
