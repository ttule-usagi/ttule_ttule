import { useModalStore } from '@/lib/store/modalStore';
import { useDeletePlaceList } from './useDeletePlaceList';
import { useRouter } from 'next/navigation';

export const useConfirmDeletePlaceList = () => {
  const router = useRouter();
  const { mutateAsync: deletePlaceList } = useDeletePlaceList();
  const { open } = useModalStore();

  const confirmDeletePlaceList = async (listName: string, listId: string, routerBack: boolean) => {
    open({
      type: 'confirmAction',
      props: {
        description: `'${listName}' 리스트를 삭제하시겠어요?`,
        confirmButtonText: '삭제하기',
        onConfirm: async () => {
          await deletePlaceList(listId);
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('리스트가 삭제되었습니다.')

          // 상세페이지에서 삭제 실행 시 이전페이지(목록 페이지)로 이동
          if (routerBack) {
            const isInternal = document.referrer.includes(window.location.host);

            // 서비스 내에 이전 페이지가 있으면 back, 없으면 리스트 목록 페이지로 강제 라우팅
            if (isInternal) {
              router.back();
            } else {
              router.push('/places');
            }
          }
        },
      },
    });
  };

  return { confirmDeletePlaceList };
};
