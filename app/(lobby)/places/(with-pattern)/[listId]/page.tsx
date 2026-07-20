import TagList from '@/components/features/Place/TagList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PlaceListHeader from '@/components/features/Place/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/Place/PlaceListPlaces';
import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { prefetchPlaceListDetail } from '@/lib/actions/api/prefetch/prefetchPlaceListDetail';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { placeListDetailQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';
import ForbiddenRedirect from '@/components/features/invite/ForbiddenRedirect';
import { auth } from '@/lib/utils/auth';

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const session = await auth(); // 버튼 렌더링 여부 결정을 위해 세션 조회
  const queryClient = getQueryClient();

  try {
    // 헤더 조회에서 FORBIDDEN을 바로 판단
    await queryClient.fetchQuery(placeListDetailQueryOptions(listId));
  } catch (error) {
    if (error instanceof Error && error.message === '42501') {
      return <ForbiddenRedirect />;
    }
    throw error;
  }

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
          <PlaceListHeader
            listId={listId}
            hasSession={!!session}
          />
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
