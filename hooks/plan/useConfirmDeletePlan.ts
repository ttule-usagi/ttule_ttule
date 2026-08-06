import { usePathname, useRouter } from 'next/navigation';

import { useModalStore } from '@/lib/store/modalStore';

import { useDeletePlan } from './useDeletePlan';

export const useConfirmDeletePlan = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: deletePlan } = useDeletePlan();
  const { open } = useModalStore();

  const confirmDeletePlan = async (planName: string, planId: string, routerBack: boolean) => {
    open({
      type: 'confirmAction',
      props: {
        description: `'${planName}' 계획을 삭제하시겠어요?`,
        confirmButtonText: '삭제하기',
        onConfirm: async () => {
          await deletePlan(planId);
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('계획이 삭제되었습니다.')

          const segments = pathname.split('/').filter(Boolean);
          const isPlanDetailPage = segments[0] === 'plan' && segments.length === 2;

          if (routerBack) {
            // 상세페이지에서 삭제 실행 시 이전페이지(목록 페이지)로 이동
            if (isPlanDetailPage) {
              router.back();
            } else {
              // plan 상세페이지 내의 더 깊은 라우트인 경우 /lobby로 이동 처리
              router.replace('/lobby');
            }
          }
        },
      },
    });
  };

  return { confirmDeletePlan };
};
