import TagList from '@/components/features/place-list/tag/TagList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PlaceListHeader from '@/components/features/place-list/detail/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/place-list/detail/PlaceListPlaces';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { prefetchPlaceListDetail } from '@/lib/actions/api/prefetch/prefetchPlaceListDetail';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { placeListDetailQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';
import ForbiddenRedirect from '@/components/features/invite/ForbiddenRedirect';
import { auth } from '@/lib/utils/auth';
import { handleInviteAccess } from '@/lib/utils/invite/handleInviteAcess';
import { getPlaceListDetail } from '@/lib/actions/api/placeList';
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
          <PlaceListHeader
            listId={listId}
            hasSession={!!session}
          />
        </QueryBoundary>

        <div className='flex flex-col gap-3'>
          <QueryBoundary subject='태그'>
            <TagList listId={listId} />
          </QueryBoundary>
          <QueryBoundary subject='저장된 장소'>
            <PlaceListPlaces listId={listId} />
          </QueryBoundary>
        </div>
      </div>
    </HydrationBoundary>
  );
}
