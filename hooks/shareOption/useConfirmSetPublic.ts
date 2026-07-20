import { ResourceParams } from '@/types/shareOption';
import { useSetPublic } from './useSetPublic';
import { useModalStore } from '@/lib/store/modalStore';

export const useConfirmSetPublic = ({ id, resourceType }: ResourceParams) => {
  const { open } = useModalStore();
  const { mutateAsync: setPublic, isPending } = useSetPublic({ id, resourceType });

  const handleConfirmSetPublic = (isPublic: boolean) => {
    open({
      type: 'confirmAction',
      props: {
        description: `${resourceType === 'plan' ? '계획' : '리스트'} 공개 여부를 변경할까요?`,
        confirmButtonText: '변경하기',
        onConfirm: async () => {
          await setPublic({ id, resourceType, isPublic });
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('공개 설정이 변경되었습니다.')
        },
      },
    });
  };

  return { handleConfirmSetPublic, isPending };
};
