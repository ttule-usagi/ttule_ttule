import { useModalStore } from '@/lib/store/modalStore';

import { useWithdraw } from './useWithdraw';

export const useConfirmWithdraw = () => {
  const { open } = useModalStore();
  const { mutate: withdraw } = useWithdraw();

  const confirmWithdraw = () => {
    open({
      type: 'confirmAction',
      props: {
        description: '정말 탈퇴하시겠어요?\n탈퇴 시 저장된 모든 데이터가 초기화됩니다.',
        confirmButtonText: '탈퇴하기',
        onConfirm: async () => {
          await withdraw();
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('유저가 삭제되었습니다.')
        },
      },
    });
  };

  return { confirmWithdraw };
};
