import { ResourceParams } from '@/types/shareOption';
import { useDeleteMember } from './useDeleteMember';
import { useModalStore } from '@/lib/store/modalStore';

export const useConfirmDeleteMember = ({ id, resourceType }: ResourceParams) => {
  const { open } = useModalStore();
  const { mutateAsync: deleteMemberMutate } = useDeleteMember({ id, resourceType });

  const confirmDeleteMember = (targetUserId: string) => {
    open({
      type: 'confirmAction',
      props: {
        description: '해당 유저를 삭제하시겠어요?',
        confirmButtonText: '삭제하기',
        onConfirm: async () => {
          await deleteMemberMutate({ id, resourceType, targetUserId });
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('유저가 삭제되었습니다.')
        },
      },
    });
  };

  return { confirmDeleteMember };
};
