import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import PlanDetailContainer from '@/components/features/plan/plan-detail/PlanDetailContainer';
import { handleInviteAccess } from '@/lib/utils/invite/handleInviteAcess';
import { Suspense } from 'react';
import { auth } from '@/lib/utils/auth';
import { getSharedQueryClient } from '@/lib/utils/getSharedQueryClient';
import { RpcError } from '@/types/errors';
import ForbiddenRedirect from '@/components/features/invite/ForbiddenRedirect';
import { getPlanDetail } from '@/lib/actions/api/plan';
import { supabaseAdmin, supabaseUser } from '@/lib/utils/supabase';
import { planDetailQueryOptions } from '@/hooks/plan/useGetPlanDetail';

export default async function PlanDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite_token?: string }>;
}) {
  const { id } = await params;
  const { invite_token: inviteToken } = await searchParams;

  const queryClient = getSharedQueryClient();
  const session = await auth();
  const supabase = session ? await supabaseUser() : supabaseAdmin;

  await handleInviteAccess({
    inviteToken,
    session,
    resourceId: id,
    resourceType: 'plan',
  });

  try {
    // 헤더 조회에서 FORBIDDEN을 바로 판단
    await queryClient.fetchQuery({
      ...planDetailQueryOptions(id),
      queryFn: () => getPlanDetail({ supabase, planId: id }),
    });
  } catch (error) {
    if (error instanceof RpcError && error.message === 'FORBIDDEN') {
      return <ForbiddenRedirect />;
    }
    throw error;
  }

  return (
    <>
      <Suspense fallback={null}>
        <InviteEditorHandler hasInviteToken={!!inviteToken} />
      </Suspense>
      <PlanDetailContainer
        planId={id}
        hasSession={!!session}
      />
    </>
  );
}
