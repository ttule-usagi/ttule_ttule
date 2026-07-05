import TagList from '@/components/features/Place/TagList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PlaceListHeader from '@/components/features/Place/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/Place/PlaceListPlaces';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { prefetchPlaceListDetail } from '@/lib/actions/prefetch/prefetchPlaceListDetail';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { checkInviteToken } from '@/lib/utils/invite/checkInviteToken';

export default async function PlaceListDetail({
  params,
  searchParams,
}: {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ invite_token?: string | string[]; from?: string }>;
}) {
  const { listId } = await params;
  const { invite_token, from } = await searchParams;

  // 브라우저 url로 장소 리스트 진입 시 토큰 검증
  await checkInviteToken({ inviteToken: invite_token, from: from, resourceId: listId, resourceType: 'place_list' });

  const queryClient = getQueryClient();
  await prefetchPlaceListDetail(queryClient, listId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <InviteEditorHandler
          id={listId}
          resourceType='place_list'
        />
      </Suspense>
      <div className='flex flex-col gap-5.5'>
        <QueryBoundary>
          <PlaceListHeader listId={listId} />
        </QueryBoundary>

        <div className='flex flex-col gap-3'>
          <QueryBoundary>
            <TagList listId={listId} />
          </QueryBoundary>
          <QueryBoundary>
            <PlaceListPlaces listId={listId} />
          </QueryBoundary>
        </div>
      </div>
    </HydrationBoundary>
  );
}
