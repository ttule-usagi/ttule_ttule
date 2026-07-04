import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { checkInviteToken } from '@/lib/utils/invite/checkInviteToken';
import { Suspense } from 'react';

export default async function PlanDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite_token?: string | string[]; from?: string }>;
}) {
  const { id } = await params;
  const { invite_token, from } = await searchParams;

  // 브라우저 url로 장소 리스트 진입 시 토큰 검증
  await checkInviteToken({ inviteToken: invite_token, from: from, resourceId: id, resourceType: 'plan' });
  return (
    <>
      <Suspense fallback={null}>
        <InviteEditorHandler
          id={id}
          resourceType='plan'
        />
      </Suspense>
      <span>계획 디테일</span>
    </>
  );
}
