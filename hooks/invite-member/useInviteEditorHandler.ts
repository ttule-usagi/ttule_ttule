import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAddEditMember } from './useAddEditMember';
import { useEffect } from 'react';
import { useModalStore } from '@/lib/store/modalStore';
import { ResourceType } from '@/types/invite';
import { useSession } from 'next-auth/react';

// 라우터를 감지하고 참여 유저(editor)로 추가하는 훅
export const useInviteEditorHandler = (id: string, type: ResourceType) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { mutate: addEditMember } = useAddEditMember();
  const { open } = useModalStore();

  useEffect(() => {
    const token = searchParams.get('invite_token');
    if (!token) return;

    // 비로그인 유저일 경우 호출 없이 바로 로그인 페이지로 이동
    if (status === 'loading') return;
    if (!session) {
      // 로그인 이후 다시 참여 로직 시도
      router.replace('/login');
      return;
    }

    addEditMember(
      { token, id, type },
      {
        // 토큰 확인되면 토큰 파라미터 제거하고 순수한 링크로 접속
        onSuccess: () => {
          router.replace(pathname);
        },
        onError: (error) => {
          // 에러 모달
          console.error(error);
          open({
            type: 'error',
            props: {
              title: `${type === 'place_list' ? '장소 리스트' : '계획'} 참여 실패`,
              description: '초대 링크가 유효하지 않습니다.\n링크를 다시 확인해주세요.',
            },
          });
          router.replace(pathname);
        },
      },
    );
  }, [session]);
};
