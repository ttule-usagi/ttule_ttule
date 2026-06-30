import TagList from '@/components/features/Place/TagList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  placeListDetailQueryOptions,
  placeListPlacesQueryOptions,
  placeListTagsQueryOptions,
} from '@/hooks/place-list/useGetPlaceListDetail';
import PlaceListHeader from '@/components/features/Place/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/Place/PlaceListPlaces';
import InviteEditorHandler from '@/components/features/invite/inviteEditorHandler';

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // prefetch한 데이터를 클라이언트에서 즉시 다시 fetch하는 걸 방지
        staleTime: 60 * 1000, // 1분
      },
    },
  });

  await Promise.all([
    queryClient.prefetchQuery(placeListDetailQueryOptions(listId)),
    queryClient.prefetchInfiniteQuery(placeListPlacesQueryOptions(listId)),
    queryClient.prefetchQuery(placeListTagsQueryOptions(listId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InviteEditorHandler type='place_list' />
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
