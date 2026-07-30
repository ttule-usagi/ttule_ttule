import { Suspense } from 'react';

import ForbiddenRedirect from '@/components/features/invite/ForbiddenRedirect';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import PlanDetailContainer from '@/components/features/plan/plan-detail/PlanDetailContainer';
import { planDetailQueryOptions } from '@/hooks/plan/useGetPlanDetail';
import { getPlanDetail } from '@/lib/actions/api/plan';
import { auth } from '@/lib/utils/auth';
import { getSharedQueryClient } from '@/lib/utils/getSharedQueryClient';
import { handleInviteAccess } from '@/lib/utils/invite/handleInviteAcess';
import { supabaseAdmin, supabaseUser } from '@/lib/utils/supabase';
import { RpcError } from '@/types/errors';

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
