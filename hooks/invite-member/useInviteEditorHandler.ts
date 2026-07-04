import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAddEditMember } from './useAddEditMember';
import { useEffect } from 'react';
import { useModalStore } from '@/lib/store/modalStore';
import { InviteHookParams } from '@/types/invite';
import { useSession } from 'next-auth/react';
import { DEFAULT_INVITE_ERROR_PROPS, INVITE_ERROR_MESSAGES, InviteErrorCode } from '@/lib/constants/inviteErrorMessage';
import { useQueryClient } from '@tanstack/react-query';

// 라우터를 감지하고 참여 유저(editor)로 추가하는 훅
export const useInviteEditorHandler = ({ id, resourceType }: InviteHookParams) => {
  const queryclient = useQueryClient();
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

    // 여기까지 넘어왔을 때는 이미 라우팅 성공 이후
    addEditMember(
      { token, id, type: resourceType },
      {
        // 토큰 확인되면 토큰 파라미터 제거하고 순수한 링크로 접속
        onSuccess: (result) => {
          if ('error' in result) {
            open({
              type: 'inviteError',
              props: INVITE_ERROR_MESSAGES[resourceType][result.error as InviteErrorCode] ?? DEFAULT_INVITE_ERROR_PROPS,
            });
            router.replace(pathname);
            return;
          }

          queryclient.invalidateQueries({
            // TODO: plan 전체조회 쿼리키 확인 필요
            queryKey: resourceType === 'plan' ? ['plan', 'list'] : ['place-list'],
          });

          router.replace(pathname);
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  }, [session, searchParams]);
};
