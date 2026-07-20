import { useModalStore } from '@/lib/store/modalStore';
import { useDeletePlaceList } from './useDeletePlaceList';

export const useConfirmDeletePlaceList = () => {
  const { mutateAsync: deletePlaceList } = useDeletePlaceList();
  const { open } = useModalStore();

  const confirmDeletePlaceList = (listName: string, listId: string) => {
    open({
      type: 'confirmAction',
      props: {
        description: `'${listName}' 리스트를 삭제하시겠어요?`,
        confirmButtonText: '삭제하기',
        onConfirm: async () => {
          await deletePlaceList(listId);
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('리스트가 삭제되었습니다.')
        },
      },
    });
  };

  return { confirmDeletePlaceList };
};
