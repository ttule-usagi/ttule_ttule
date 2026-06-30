import { ResourceType } from '@/lib/actions/invite';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAddEditMember } from './useAddEditMember';
import { useEffect } from 'react';

// 라우터를 감지하고 참여 유저(editor)로 추가하는 훅
export const useInviteEditorHandler = (type: ResourceType) => {
  const searchParmas = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: addEditMember } = useAddEditMember();

  useEffect(() => {
    const token = searchParmas.get('invite_token');
    if (!token) return;

    addEditMember(
      { token, type },
      {
        // 토큰 확인되면 토큰 파라미터 제거하고 순수한 링크로 접속
        onSuccess: () => {
          router.replace(pathname);
        },
        onError: (error) => {
          // 에러 모달
          console.error(error);
          router.replace(pathname);
        },
      },
    );
  });
};
