import { checkInviteToken } from '@/lib/utils/invite/checkInviteToken';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import PlanDetailContainer from '@/components/features/plan/PlanDetailContainer';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { Suspense } from 'react';

export default async function PlanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite_token?: string | string[]; from?: string }>;
}) {
  const { id } = await params;
  const { invite_token, from } = await searchParams;

  await checkInviteToken({
    inviteToken: invite_token,
    from,
    resourceId: id,
    resourceType: 'plan',
  });

  return (
    <>
      <Suspense fallback={null}>
        <InviteEditorHandler
          id={id}
          resourceType='plan'
        />
      </Suspense>
      <QueryBoundary>
        <PlanDetailContainer planId={id} />
      </QueryBoundary>
    </>
  );
}
