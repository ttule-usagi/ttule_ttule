import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import ForbiddenRedirect from '@/components/features/invite/ForbiddenRedirect';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import PlaceListContent from '@/components/features/place-list/detail/PlaceListContent';
import PlaceListHeader from '@/components/features/place-list/detail/PlaceListHeader';
import { placeListDetailQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';
import { getPlaceListDetail } from '@/lib/actions/api/placeList';
import { prefetchPlaceListDetail } from '@/lib/actions/api/prefetch/prefetchPlaceListDetail';
import { auth } from '@/lib/utils/auth';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { handleInviteAccess } from '@/lib/utils/invite/handleInviteAcess';
import { supabaseUser } from '@/lib/utils/supabase';
import { RpcError } from '@/types/errors';

export default async function PlaceListDetail({
  params,
  searchParams,
}: {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ invite_token?: string }>;
}) {
  const { listId } = await params;
  const session = await auth(); // 버튼 렌더링 여부 결정을 위해 세션 조회
  const queryClient = getQueryClient();
  const supabase = await supabaseUser();
  const { invite_token: inviteToken } = await searchParams;

  await handleInviteAccess({
    inviteToken,
    session,
    resourceId: listId,
    resourceType: 'place_list',
  });

  try {
    // 헤더 조회에서 FORBIDDEN을 바로 판단
    await queryClient.fetchQuery({
      ...placeListDetailQueryOptions(listId),
      queryFn: () => getPlaceListDetail({ supabase, listId }),
    });
  } catch (error) {
    if (error instanceof RpcError && error.message === 'FORBIDDEN') {
      return <ForbiddenRedirect />;
    }
    throw error;
  }

  await prefetchPlaceListDetail(queryClient, listId, supabase);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <InviteEditorHandler hasInviteToken={!!inviteToken} />
      </Suspense>
      <div className='flex flex-col gap-5.5'>
        <QueryBoundary subject='리스트 상세정보'>
          <PlaceListHeader listId={listId} />
        </QueryBoundary>
        <PlaceListContent listId={listId} />
      </div>
    </HydrationBoundary>
  );
}
