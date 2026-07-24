import { useModalStore } from '@/lib/store/modalStore';
import { useDeletePlace } from './useDeletePlace';

export const useConfirmDeletePlace = (listId: string) => {
  const { mutateAsync: deletePlace } = useDeletePlace(listId);
  const { open } = useModalStore();

  const confirmDeletePlaceList = async (placeName: string, placeId: string) => {
    open({
      type: 'confirmAction',
      props: {
        description: `'${placeName}'을 삭제하시겠어요?`,
        confirmButtonText: '삭제하기',
        onConfirm: async () => {
          await deletePlace(placeId);
          // TODO: 성공 토스트 알림 등 추가
          // toast.success(`${placeName}가 삭제되었습니다.`)
        },
      },
    });
  };

  return { confirmDeletePlaceList };
};
