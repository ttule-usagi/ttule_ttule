// 서버 컴포넌트 전용 유틸함수
// 페이지(서버 컴포넌트) 접근 시, inviteToken이 있으면 addEditMember를 수행하고, 에러가 발생하면 /invite-invalid로 리다이렉트

import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import { addEditMember } from '@/lib/actions/invite';
import { ResourceType } from '@/types/invite';
import { RESOURCE_ROUTE } from '@/lib/constants/ResourceType';

interface HandleInviteAccessParams {
  inviteToken: string | undefined;
  session: Session | null;
  resourceId: string;
  resourceType: ResourceType;
}

export async function handleInviteAccess({
  inviteToken,
  session,
  resourceId,
  resourceType,
}: HandleInviteAccessParams): Promise<void> {
  if (!inviteToken) return;

  if (!session) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/${RESOURCE_ROUTE[resourceType]}/${resourceId}?invite_token=${inviteToken}`)}`,
    );
  }

  const result = await addEditMember({ token: inviteToken, id: resourceId, type: resourceType });

  if ('error' in result) {
    redirect('/invite-invalid');
  }
}
