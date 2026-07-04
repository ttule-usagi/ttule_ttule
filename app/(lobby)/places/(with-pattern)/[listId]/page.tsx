import TagList from '@/components/features/Place/TagList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PlaceListHeader from '@/components/features/Place/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/Place/PlaceListPlaces';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { prefetchPlaceListDetail } from '@/lib/actions/prefetch/prefetchPlaceListDetail';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { verifyInviteToken } from '@/lib/actions/invite';
import { redirect } from 'next/navigation';

export default async function PlaceListDetail(props: PageProps<'/places/[listId]'>) {
  const { listId } = await props.params;
  const { invite_token, from } = await props.searchParams;

  // 브라우저 URL 로 접속한 경우, 서버 컴포넌트에서 not-found 페이지 호출
  if (invite_token && from !== 'modal') {
    const token = Array.isArray(invite_token) ? invite_token[0] : invite_token;
    const tokenStatus = await verifyInviteToken({ token, id: listId, type: 'place_list' });

    if (tokenStatus === 'INVALID' || tokenStatus === 'EXPIRED') {
      // notFound();
      redirect('/404');
    }
  }

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
