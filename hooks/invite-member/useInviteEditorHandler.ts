import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 라우터를 감지하고 페이지 내부에서 모달 에러를 띄울 일이 있을 때 + invite_token 파라미터를 제거하는 훅
export const useInviteEditorHandler = ({ hasInviteToken }: { hasInviteToken: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasInviteToken) return;

    // 여기까지 넘어왔을 때는 이미 라우팅 및 참여 성공 이후
    router.replace(pathname);
  }, []);
};
