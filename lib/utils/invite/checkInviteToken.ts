import { verifyInviteToken } from '@/lib/actions/invite';
import { ResourceType } from '@/types/invite';
import { redirect } from 'next/navigation';

// 서버 컴포넌트 전용 함수 - 초대 토큰 검증
export const checkInviteToken = async ({
  inviteToken,
  from,
  resourceId,
  resourceType,
}: {
  inviteToken: string | string[] | undefined;
  from: string | undefined;
  resourceId: string;
  resourceType: ResourceType;
}) => {
  if (!inviteToken || from === 'modal') return;

  const token = Array.isArray(inviteToken) ? inviteToken[0] : inviteToken;
  const tokenStatus = await verifyInviteToken({ token, id: resourceId, type: resourceType });

  if (tokenStatus === 'INVALID' || tokenStatus === 'EXPIRED') {
    // notFound()
    redirect('/not-found');
  }
};
